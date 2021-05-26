import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

class DeleteIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            open: this.props.open ? this.props.open : false,
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleDelete() {
        this.handleClose({action: 'delete'});
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
                    <DialogTitle id="form-dialog-title"> Delete Incident</DialogTitle>
                    <DialogContent>
                        Are you sure to delete the incident?
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={this.handleClose}>cancel</Button>
                        <Button autoFocus onClick={this.handleDelete} variant="outlined" color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )

    }
}

export default DeleteIncidentDialog;
