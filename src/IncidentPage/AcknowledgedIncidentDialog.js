import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar} from "@material-ui/core";
import {incidentService} from "@/_services";
import {Alert} from "@material-ui/lab";

class AcknowledgedIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            open: this.props.open ? this.props.open : false,
            showSuccess: false,
            showError: false,
        };

        this.handleAcknowledge = this.handleAcknowledge.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessSnackbarOpen = this.handleSuccessSnackbarOpen.bind(this);
        this.handlSnackbarClose = this.handlSnackbarClose.bind(this);
        this.handleErrorSnackbarOpen = this.handleErrorSnackbarOpen.bind(this);
    }

    handleAcknowledge() {
        const {incident} = this.state;
        incidentService.acknowledge(incident.id)
            .then(response => {
                if (response) {
                    this.handleSuccessSnackbarOpen();
                    this.handleClose();
                } else {
                    this.handleErrorSnackbarOpen();
                    this.handleClose();
                }
            })
    }

    handleClickOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.props.callbackModal({action: 'acknowledge'});
        this.setState({open: false});
    };

    handleSuccessSnackbarOpen() {
        this.setState({showSuccess: true});
    };

    handleErrorSnackbarOpen() {
        this.setState({showError: true});
    };

    handlSnackbarClose() {
        this.setState({showSuccess: false, showError: false});
    };

    render() {
        const {open, showSuccess, showError} = this.state;
        return (
            <div>
                {/*<Button size="small" variant="outlined" color="primary" onClick={this.handleClickOpen}>*/}
                {/*    Acknowledge*/}
                {/*</Button>*/}
                <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title"> Acknowledge Incident</DialogTitle>
                    <DialogContent>
                        Click on 'Ok' button to acknowledge the incident.
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={this.handleClose}>cancel</Button>
                        <Button autoFocus onClick={this.handleAcknowledge} variant="outlined" color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="success">
                        Acknowledge successfully.
                    </Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="error">
                        Failed to acknowledge.
                    </Alert>
                </Snackbar>
            </div>
        )

    }
}

export default AcknowledgedIncidentDialog;
