import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Snackbar,
    TextField
} from "@material-ui/core";
import {incidentService} from "@/_services";
import {Alert} from "@material-ui/lab";
import * as Yup from "yup";
import {Formik} from "formik";

const styles = {
    dialogAction: {
        paddingRight: 0
    }
}

class ResolveIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            open: false,
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
        this.props.callbackModal();
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
        const {open,incident, showSuccess, showError} = this.state;
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Resolve
                </Button>
                <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title"> Acknowledge Incident</DialogTitle>
                    <DialogContent>
                        <Formik
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true)
                                incidentService.resolve({id: incident.id, comment: values.comment})
                                    .then(response => {
                                        if (response) {
                                            this.handleSuccessSnackbarOpen();
                                            this.handleClose();
                                        } else {
                                            setSubmitting(false);
                                            this.handleErrorSnackbarOpen();
                                        }
                                    })
                            }}
                            initialValues={{
                                comment: ''
                            }}
                            validationSchema={Yup.object().shape({
                                comment: Yup
                                    .string('Enter comment')
                                    .required('Name is required')
                            })}
                        >
                            {props => {
                                const {
                                    values, touched, errors, isSubmitting, handleChange, handleSubmit
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <TextField label="Comment" name="comment" value={values.comment}
                                                       onChange={handleChange}
                                                       multiline variant="outlined"
                                                       rows={4} fullWidth={true}
                                                       error={errors.comment && touched.comment}
                                                       helperText={errors.comment && touched.comment ? 'Comment is required' : ' '}
                                            />

                                        </Grid>
                                        <DialogActions style={styles.dialogAction}>
                                            <Button type="button" onClick={this.handleClose}>cancel</Button>
                                            <Button type="submit" variant="outlined" color="primary"
                                                    disabled={isSubmitting}>Resolve</Button>
                                        </DialogActions>
                                    </form>
                                )
                            }}
                        </Formik>
                    </DialogContent>
                </Dialog>
                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="success">
                        Resolve successfully saved.
                    </Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="error">
                        Failed to resolve the incident.
                    </Alert>
                </Snackbar>
            </div>
        )

    }
}

export default ResolveIncidentDialog;
