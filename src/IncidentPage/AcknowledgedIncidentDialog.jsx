import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

class AcknowledgedIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            open: this.props.open ? this.props.open : false,
        };

        this.handleAcknowledge = this.handleAcknowledge.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleAcknowledge() {
        this.handleClose({action: 'acknowledge'});
    }

    handleClickOpen() {
        this.setState({open: true});
    };

    handleClose(e) {
        this.props.callbackModal(e);
        this.setState({open: false});
    };


    render() {
        const {open} = this.state;
        return (
            <div>
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
            </div>
        )

    }
}

export default AcknowledgedIncidentDialog;
