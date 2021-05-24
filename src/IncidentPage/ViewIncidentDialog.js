import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import Moment from 'react-moment';
import {incidentService} from "@/_services";

class ViewIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            users: this.props.users,
            incidentTypes: this.props.incidentTypes,
            open: false
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {

    }

    handleClickOpen() {
        const {incident} = this.state;
        incidentService.getById(incident.id).then(incident => this.setState({incident: incident.data}));
        this.setState({open: true});

    };

    handleClose() {
        this.setState({open: false});
    };

    getUserName(id) {
        const {users} = this.state
        const user = users ? users.find(user => user.id === id) : null;
        return user ? user.fullName : '-';

    }

    render() {
        const {open, incident, incidentTypes } = this.state;
        return (
            <div>
                <Button size="small" variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    View
                </Button>
                <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title"> Incident Details</DialogTitle>
                    <DialogContent>
                        {incident && <Grid container spacing={2}>
                            <Grid item xs={4}><Typography><strong>Incident Type:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incidentTypes.find(i => i.key === incident.typeOfIncident).value}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Location:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.location}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Incident Date:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.datetimeOfIncident}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Name of Affected:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.nameOfAffected}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Name of Supervisor:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.nameOfSupervisor}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Root Cause:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.rootCaseOfAccident}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Description:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.descriptionOfIncident ? incident.descriptionOfIncident : '-'}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Name of Handler:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{this.getUserName(incident.nameOfHandler)}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Acknowledged:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.isAcknowledged ? 'Yes' : 'No'}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Time of Acknowledge:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.tsAcknowledged ? <Moment format="YYYY-MM-DD HH:mm">{incident.tsAcknowledged}</Moment> : '-'}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Resolved:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.isResolved ? 'Yes' : 'No'}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Time of Resolved:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.tsResolved ? <Moment format="YYYY-MM-DD HH:mm">{incident.tsResolved}</Moment> : '-'}</Typography></Grid>

                            <Grid item xs={4}><Typography><strong>Comment:</strong></Typography></Grid>
                            <Grid item xs={8}><Typography>{incident.comment ? incident.comment : '-'}</Typography></Grid>
                        </Grid>}
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleClose} variant="outlined" color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )

    }
}

export default ViewIncidentDialog;
