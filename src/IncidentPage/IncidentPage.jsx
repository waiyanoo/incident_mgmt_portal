import React from 'react';
import {incidentService} from "@/_services";
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
        };
    }

    componentDidMount() {
        this.retrieveIncidents();
    }

    retrieveIncidents(){
        incidentService.getAll().then(incidents => this.setState({ incidents: incidents.data, meta: incidents.meta }));
    }

    render() {
        const { incidents } = this.state;
        console.log(incidents)
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <h2>Incident</h2>
                    <EditIncidentDialog callbackModal={this.callbackModal}/>
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
                                    <TableCell align="left">{row.nameOfHandler}</TableCell>
                                    <TableCell align="left">{row.isAcknowledged ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="left">{row.isResolved ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="right">
                                        {/*<EditUserDialog user={row} callbackModal={this.callbackModal}/>*/}

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
