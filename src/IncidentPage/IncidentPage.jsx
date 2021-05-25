import React from 'react'
import {authenticationService, incidentService, userService} from "@/_services";
import {
    Chip,
    Container, FormControl,
    Grid, Input, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow, TextField
} from "@material-ui/core";
import EditIncidentDialog from "@/IncidentPage/EditIncidentDialog";
import {Alert} from "@material-ui/lab";
import AcknowledgedIncidentDialog from "@/IncidentPage/AcknowledgedIncidentDialog";
import ResolveIncidentDialog from "@/IncidentPage/ResolveIncidentDialog";
import ViewIncidentDialog from "@/IncidentPage/ViewIncidentDialog";
import Moment from "react-moment";
import * as QueryString from "query-string"

const INCIDENT_TYPES = [
    {key: 'injury', value: 'Injury'},
    {key: 'near_miss', value: 'Near Miss'},
    {key: 'property_damage', value: 'Property Damage'},
    {key: 'theft', value: 'Theft'}
]

const SORTING = [
    {key: 'sort[tsModified]=asc', value: 'Updated Time (Ascending)'},
    {key: 'sort[tsModified]=desc', value: 'Updated Time (Descending)'},
    {key: 'sort[typeOfIncident]=asc', value: 'Incident Type (A-Z)'},
    {key: 'sort[typeOfIncident]=desc', value: 'Incident Type (Z-A)'}
]

const styles = {
    grid : {
        marginLeft: 5
    },
    spacing: {
        marginTop: 10,
        marginBottom: 10
    },
    formControl: {
        marginTop: 10,
        marginBottom: 10,
        minWidth: 250
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class IncidentPage extends React.Component {
    constructor(props) {
        super(props);
        // const parms =  QueryString.stringify(props.location.search);
        // console.log(location.search)
        this.state = {
            incidents: [],
            meta: null,
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            users: null,
            sorting: 'sort[tsModified]=desc',
            filter: [],
            filterQuery: null,
            rowsPerPage: 5,
            page: 0
        };

        this.callbackModal = this.callbackModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterHandleChange = this.filterHandleChange.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    componentDidMount() {
        const {currentUser} = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({userFromApi: userFromApi.data}));
        if (currentUser.role === 'Admin') {
            userService.getAll().then(users => this.setState({users: users.data}));
        }
        this.retrieveIncidents();
    }

    callbackModal() {
        this.retrieveIncidents();
    }

    retrieveIncidents() {
        this.retrieveAllIncident();
    }

    getUserName(id) {
        const {users, currentUser} = this.state;
        if (currentUser.role === 'Admin') {
            const user = users ? users.find(user => user.id === id) : null;
            return user ? user.fullName : '-';
        }
        return currentUser.fullName;

    }

    handleChange(e) {
        this.setState({ sorting: e.target.value });
        // this.props.history.push({
        //     pathname: '/incident',
        //     search: `?${e.target.value}`
        // });
        const { filterQuery, rowsPerPage, page} = this.state;
        incidentService.getAll(e.target.value, filterQuery, rowsPerPage, page).then(incidents => this.setState({incidents: incidents.data, meta: incidents.meta}));
    }

    filterHandleChange(e){
        const  options  = e.target.value;
        let filter = '';
        options.map(option => {
            filter += `&filter[typeOfIncident]=${option}`;
        })
        this.setState({filter: options, filterQuery: filter});
        const {sorting, rowsPerPage, page} = this.state;
        incidentService.getAll(sorting, filter, rowsPerPage, page).then(incidents => this.setState({incidents: incidents.data, meta: incidents.meta}));
    }

    handleChangePage(e, newPage){
        this.setState({page: newPage});
        const {sorting, filterQuery, rowsPerPage} = this.state;
        incidentService.getAll(sorting, filterQuery, rowsPerPage, newPage).then(incidents => this.setState({incidents: incidents.data, meta: incidents.meta}));
    }

    handleChangeRowsPerPage(e){
        this.setState({page: 0, rowsPerPage: parseInt(e.target.value, 10)});
        const {sorting, filterQuery} = this.state;
        incidentService.getAll(sorting, filterQuery, parseInt(e.target.value, 10), 0).then(incidents => this.setState({incidents: incidents.data, meta: incidents.meta}));
    }

    retrieveAllIncident(){
        const {sorting, filterQuery, rowsPerPage, page} = this.state;
        incidentService.getAll(sorting, filterQuery, rowsPerPage, page).then(incidents => this.setState({incidents: incidents.data, meta: incidents.meta}));
    }

    render() {
        const {incidents, meta, currentUser, users, sorting, filter, page, rowsPerPage} = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <h2>Incident</h2>
                    {currentUser.role === 'Admin' && users &&
                    <EditIncidentDialog users={users} incidentTypes={INCIDENT_TYPES} callbackModal={this.callbackModal}/>}
                </Grid>

                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    style={styles.spacing}
                >
                    <TextField label="Sort by" name="sorting" style={styles.formControl}
                               select fullWidth={false} variant="outlined"
                               value={sorting} onChange={this.handleChange}
                    >
                        {SORTING.map(type => {
                            return (
                                <MenuItem key={type.key} value={type.key}>
                                    {type.value}
                                </MenuItem>)
                        })}
                    </TextField>

                    <FormControl variant="outlined" style={styles.formControl}>
                        <InputLabel id="filter-outlined-label">Filter</InputLabel>
                        <Select
                            labelId="filter-select-outlined-label"
                            id="filter-select-outlined"
                            value={filter}
                            multiple
                            onChange={this.filterHandleChange}
                            label="Filter"
                            renderValue={(selected) => (
                                <div style={styles.chips}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={INCIDENT_TYPES.find(i => i.key === value).value} style={styles.chip} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {INCIDENT_TYPES.map((type) => (
                                <MenuItem key={type.key} value={type.key} >
                                    {type.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>

                {incidents.length > 0 &&
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell align="left">Date/time</TableCell>
                                <TableCell align="left">Location</TableCell>
                                <TableCell align="left">Handler</TableCell>
                                <TableCell align="left">Acknowledged?</TableCell>
                                <TableCell align="left">Resolved?</TableCell>
                                <TableCell align="left">Last Updated</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incidents.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {INCIDENT_TYPES.find(i => i.key === row.typeOfIncident).value}
                                    </TableCell>
                                    <TableCell align="left"><Moment format="YYYY-MM-DD HH:mm">{row.datetimeOfIncident}</Moment></TableCell>
                                    <TableCell align="left">{row.location}</TableCell>
                                    <TableCell align="left">{this.getUserName(row.nameOfHandler)}</TableCell>
                                    <TableCell align="left">{row.isAcknowledged ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="left">{row.isResolved  ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="left"><Moment format="YYYY-MM-DD HH:mm">{row.tsModified}</Moment></TableCell>
                                    <TableCell align="right">
                                        <Grid
                                            container
                                            direction="row"
                                            justify="flex-end"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <ViewIncidentDialog incident={row} incidentTypes={INCIDENT_TYPES} users={currentUser.role === 'Admin' ? users : [currentUser]}/>
                                            </Grid>
                                            <Grid item style={styles.grid}>
                                                {row.nameOfHandler === '' && currentUser.role === 'Admin' &&
                                                <EditIncidentDialog users={users} incident={row} incidentTypes={INCIDENT_TYPES}
                                                                    callbackModal={this.callbackModal}/>}
                                                {!row.isResolved &&
                                                !row.isAcknowledged &&
                                                row.nameOfHandler === currentUser.id &&
                                                <AcknowledgedIncidentDialog incident={row} callbackModal={this.callbackModal}/>}
                                                {!row.isResolved && row.isAcknowledged && row.nameOfHandler === currentUser.id &&
                                                <ResolveIncidentDialog incident={row} callbackModal={this.callbackModal}/>}
                                            </Grid>

                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10]}
                                    count={meta.total}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>

                    </Table>
                </TableContainer>}
                {incidents.length <= 0 &&
                <Alert severity="warning">There are no incident.</Alert>}
            </Container>
        );
    }
}

export {IncidentPage};
