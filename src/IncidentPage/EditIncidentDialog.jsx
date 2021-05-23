import React from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, MenuItem, Snackbar, TextField
} from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Alert} from "@material-ui/lab";
import {authenticationService, incidentService} from "@/_services";

const INCIDENT_TYPES = [
    { key: 'injury', value: 'Injury'},
    { key: 'near_miss', value: 'Near Miss'},
    { key: 'property_damage', value: 'Property Damage'},
    { key: 'theft', value: 'Theft'}
]

class EditIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authenticationService.currentUserValue,
            incident: this.props.incident ? this.props.incident : null,
            users: this.props.users,
            isError: false,
            isCreate: true,
            open: false,
            showSuccess: false,
            showError: false,
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessSnackbarOpen = this.handleSuccessSnackbarOpen.bind(this);
        this.handlSnackbarClose = this.handlSnackbarClose.bind(this);
        this.handleErrorSnackbarOpen = this.handleErrorSnackbarOpen.bind(this);
    }

    handleClickOpen(){
        this.setState({open: true});
    };

    handleClose(){
        this.props.callbackModal();
        this.setState({open: false});
    };

    handleSuccessSnackbarOpen(){
        this.setState({showSuccess: true});
    }

    handleErrorSnackbarOpen(){
        this.setState({showError: true});
    }

    handlSnackbarClose(){
        this.setState({showSuccess: false, showError: false});
    }

    render() {
        const { currentUser, incident, users, open, showSuccess, showError } = this.state;
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {incident ? 'Edit':  'Create New Incident'}
                </Button>

                <Dialog open={open} onClose={this.handleClose}  fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title">{incident ? 'Edit ' : 'Create New '}Incident</DialogTitle>
                    <DialogContent>
                        <Formik

                            onSubmit={(values) => {
                                const data = {id: '',
                                    typeOfIncident : values.typeOfIncident,
                                    location: values.location,
                                    datetimeOfIncident: values.datetimeOfIncident,
                                    nameOfAffected : values.nameOfAffected,
                                    nameOfSupervisor: values.nameOfSupervisor,
                                    descriptionOfIncident: values.descriptionOfIncident,
                                    rootCaseOfAccident: values.rootCaseOfAccident,
                                    nameOfHandler: values.nameOfHandler};
                                if(incident){
                                    data.id = incident.id;
                                    incidentService.update(data)
                                        .then(response => {
                                            if(response){
                                                this.handleSuccessSnackbarOpen();
                                                this.handleClose();
                                            } else{
                                                this.handleErrorSnackbarOpen();
                                            }
                                        })
                                } else {
                                    incidentService.create(data)
                                        .then( response => {
                                            if(response){
                                                this.handleSuccessSnackbarOpen();
                                                this.handleClose();
                                            } else{
                                                this.handleErrorSnackbarOpen();
                                            }
                                        })
                                }
                            }}
                            initialValues={{
                                typeOfIncident : incident ? incident.typeOfIncident : "",
                                location: incident ? incident.location : "",
                                datetimeOfIncident: incident ? incident.datetimeOfIncident : new Date().toISOString().slice(0, 16),
                                nameOfAffected : incident ? incident.nameOfAffected : "",
                                nameOfSupervisor: incident ? incident.nameOfSupervisor : "",
                                descriptionOfIncident: incident ? incident.descriptionOfIncident : "",
                                rootCaseOfAccident: incident ? incident.rootCaseOfAccident : "",
                                nameOfHandler: incident ? incident.nameOfHandler : ""
                            }}
                            validationSchema={Yup.object().shape({
                                typeOfIncident: Yup
                                    .string('Enter Incident type')
                                    .required('Incident type is required'),
                                location: Yup
                                    .string('Enter Location')
                                    .required('Location is required'),
                                datetimeOfIncident: Yup
                                    .string('Choose Datetime of Incient')
                                    .required('Incident Datetime is required'),
                                nameOfAffected: Yup
                                    .string('Enter Name of Affected Person')
                                    .required('Affected Person Name is required'),
                                nameOfSupervisor: Yup
                                    .string('Enter Name of Supervisor')
                                    .required('Supervisor name is required'),
                                descriptionOfIncident: Yup
                                    .string('Enter Desription'),
                                rootCaseOfAccident: Yup
                                    .string('Enter Root Case of Incident')
                                    .required('Root Case of Incident is required'),
                                nameOfHandler: Yup
                                    .string('Select name of handler')
                            })}
                        >
                            { props => { const {
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
                                            <TextField label="Type of incident" name="typeOfIncident" value={values.typeOfIncident} onChange={handleChange}
                                                       select fullWidth={true}
                                                       error={errors.typeOfIncident && touched.typeOfIncident}
                                                       helperText={errors.typeOfIncident && touched.typeOfIncident ? 'Incident type is required' : ' '}
                                            >
                                                {INCIDENT_TYPES.map( type => {
                                                   return(
                                                       <MenuItem key={type.key} value={type.key}>
                                                           {type.value}
                                                       </MenuItem>)
                                                })}
                                            </TextField>
                                            <TextField label="Location" name="location" value={values.location} onChange={handleChange}
                                                       type="text" fullWidth={true} multiline rowsMax={3}
                                                       error={errors.location && touched.location}
                                                       helperText={errors.location && touched.location ? 'Location is required' : ' '}
                                            />
                                            <TextField  label="Datetime of Incident"  value={values.datetimeOfIncident} onChange={handleChange}
                                                        ttype="date"  fullWidth={true}
                                                        error={errors.datetimeOfIncident && touched.datetimeOfIncident}
                                                        helperText={errors.datetimeOfIncident && touched.datetimeOfIncident ? 'Datetime is required' : ' '}
                                            />
                                            <TextField label="Affected Person Name" name="nameOfAffected" value={values.nameOfAffected} onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.nameOfAffected && touched.nameOfAffected}
                                                       helperText={errors.nameOfAffected && touched.nameOfAffected ? 'Affected Person Name is required' : ' '}
                                            />
                                            <TextField label="Supervisor Name" name="nameOfSupervisor" value={values.nameOfSupervisor} onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.nameOfSupervisor && touched.nameOfSupervisor}
                                                       helperText={errors.nameOfSupervisor && touched.nameOfSupervisor ? 'Supervisor Name is required' : ' '}
                                            />
                                            <TextField label="Root Cause" name="rootCaseOfAccident" value={values.rootCaseOfAccident} onChange={handleChange}
                                                       type="text" fullWidth={true} multiline rowsMax={3}
                                                       error={errors.rootCaseOfAccident && touched.rootCaseOfAccident}
                                                       helperText={errors.rootCaseOfAccident && touched.rootCaseOfAccident ? 'Rootcase is required' : ' '}
                                            />
                                            <TextField label="Description" name="descriptionOfIncident" value={values.descriptionOfIncident} onChange={handleChange}
                                                       fullWidth={true} multiline rowsMax={3}
                                            />
                                            <TextField label="Name of Handler" name="nameOfHandler" value={values.nameOfHandler} onChange={handleChange}
                                                       select fullWidth={true}
                                            >
                                                {users.map( user => {
                                                    if(user.id !== currentUser.id )
                                                    return(
                                                        <MenuItem key={user.id} value={user.id}>
                                                            {user.fullName}
                                                        </MenuItem>)
                                                })}
                                            </TextField>
                                        </Grid>
                                        <DialogActions>
                                            <Button type="button" onClick={this.handleClose}>cancel</Button>
                                            <Button type="submit" variant="outlined" color="primary" disabled={isSubmitting}>Save</Button>
                                        </DialogActions>
                                    </form>
                                )}}
                        </Formik>
                    </DialogContent>
                </Dialog>
                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="success">
                        {incident ? 'Incident successfully updated.' : 'Incident successfully created.'}
                    </Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="error">
                        {incident ? 'Failed to update Incident. Please try again.' : 'Failed to create Incident. Please try again.'}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default EditIncidentDialog
