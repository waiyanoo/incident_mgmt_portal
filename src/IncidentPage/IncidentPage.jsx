import React from 'react';
import {authenticationService, incidentService, userService} from "@/_services";
import {
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import EditIncidentDialog from "@/IncidentPage/EditIncidentDialog";

class IncidentPage extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            incidents: null,
            meta: null,
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            users: null
        };

        this.callbackModal = this.callbackModal.bind(this);
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
        if(currentUser.role === 'Admin'){
            userService.getAll().then(users => this.setState({ users }));
        }
        this.retrieveIncidents();
    }

    callbackModal(){
        this.retrieveIncidents();
    }

    retrieveIncidents(){
        incidentService.getAll().then(incidents => this.setState({ incidents: incidents.data, meta: incidents.meta }));
    }

    getUserName(id){
        const { users } = this.state
        const user = users.find(user => user.id === id);
        return user ? user.fullName : '-';
    }

    render() {
        const { incidents , currentUser, users} = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <h2>Incident</h2>
                    {currentUser.role === 'Admin' && <EditIncidentDialog users={users} callbackModal={this.callbackModal}/>}
                </Grid>

                {incidents &&
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incidents.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.typeOfIncident}
                                    </TableCell>
                                    <TableCell align="left">{row.datetimeOfIncident}</TableCell>
                                    <TableCell align="left">{row.location}</TableCell>
                                    <TableCell align="left">{this.getUserName(row.nameOfHandler)}</TableCell>
                                    <TableCell align="left">{row.isAcknowledged ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="left">{row.isResolved ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="right">

                                        {row.nameOfHandler === '' && currentUser.role === 'Admin' && <EditIncidentDialog users={users} incident={row} callbackModal={this.callbackModal}/>}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </Container>
        );
    }
}

export { IncidentPage };
