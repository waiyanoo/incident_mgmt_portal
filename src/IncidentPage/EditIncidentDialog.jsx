import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

// pick a date util library
import MomentUtils from '@date-io/moment';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {authenticationService} from "@/_services";

const styles = {
    dialogAction: {
        paddingRight: 0
    }
}

class EditIncidentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authenticationService.currentUserValue,
            incident: this.props.incident ? this.props.incident : null,
            incidentTypes: this.props.incidentTypes,
            users: this.props.users ? this.props.users : [],
            open: this.props.open  ? this.props.open : false,
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({open: true});
    };

    handleClose(e) {
        this.props.callbackModal(e);
        this.setState({ open: false });
    };

    componentWillUnmount() {
        this.setState({
            currentUser: null,
            incident: null,
            incidentTypes: [],
            users: [],
            open: false
        })
    }

    render() {
        const {currentUser, incident, incidentTypes, users, open} = this.state;
        return (
            <div>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title">{incident ? 'Edit ' : 'Create New '}Incident</DialogTitle>
                    <DialogContent>
                        <Formik
                            onSubmit={(values,  { setSubmitting }) => {
                                const data = {
                                    id: '',
                                    typeOfIncident: values.typeOfIncident,
                                    location: values.location,
                                    datetimeOfIncident: values.datetimeOfIncident,
                                    nameOfAffected: values.nameOfAffected,
                                    nameOfSupervisor: values.nameOfSupervisor,
                                    descriptionOfIncident: values.descriptionOfIncident,
                                    rootCaseOfAccident: values.rootCaseOfAccident,
                                    nameOfHandler: values.nameOfHandler
                                };
                                setSubmitting(true);
                                if (incident) {
                                    data.id = incident.id;
                                    this.handleClose({action: 'edit', data});
                                } else {
                                    this.handleClose({action: 'create', data});
                                }
                            }}
                            initialValues={{
                                typeOfIncident: incident ? incident.typeOfIncident : "",
                                location: incident ? incident.location : "",
                                datetimeOfIncident: incident ? incident.datetimeOfIncident : new Date(),
                                nameOfAffected: incident ? incident.nameOfAffected : "",
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
                            {props => {
                                const {
                                    values, touched, errors, isSubmitting, handleChange, handleSubmit, setFieldValue
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <TextField label="Type of incident" name="typeOfIncident"
                                                       value={values.typeOfIncident} onChange={handleChange}
                                                       select fullWidth={true} variant="outlined"
                                                       error={errors.typeOfIncident && touched.typeOfIncident}
                                                       helperText={errors.typeOfIncident && touched.typeOfIncident ? 'Incident type is required' : ' '}
                                            >
                                                {incidentTypes.map(type => {
                                                    return (
                                                        <MenuItem key={type.key} value={type.key}>
                                                            {type.value}
                                                        </MenuItem>)
                                                })}
                                            </TextField>
                                            <TextField label="Location" name="location" value={values.location}
                                                       onChange={handleChange} variant="outlined"
                                                       type="text" fullWidth={true} multiline rows={3} rowsMax={3}
                                                       error={errors.location && touched.location}
                                                       helperText={errors.location && touched.location ? 'Location is required' : ' '}
                                            />
                                            <DateTimePicker label="Datetime of Incident"
                                                            value={values.datetimeOfIncident}
                                                            style={{marginBottom: 20}}
                                                            fullWidth={true}
                                                            inputVariant="outlined"
                                                            format="YYYY-MM-DD HH:mm"
                                                            onChange={date => setFieldValue('datetimeOfIncident', date)}/>
                                            <TextField label="Affected Person Name" name="nameOfAffected"
                                                       value={values.nameOfAffected} onChange={handleChange}
                                                       type="text" fullWidth={true} variant="outlined"
                                                       error={errors.nameOfAffected && touched.nameOfAffected}
                                                       helperText={errors.nameOfAffected && touched.nameOfAffected ? 'Affected Person Name is required' : ' '}
                                            />
                                            <TextField label="Supervisor Name" name="nameOfSupervisor"
                                                       value={values.nameOfSupervisor} onChange={handleChange}
                                                       type="text" fullWidth={true} variant="outlined"
                                                       error={errors.nameOfSupervisor && touched.nameOfSupervisor}
                                                       helperText={errors.nameOfSupervisor && touched.nameOfSupervisor ? 'Supervisor Name is required' : ' '}
                                            />
                                            <TextField label="Root Cause" name="rootCaseOfAccident"
                                                       value={values.rootCaseOfAccident} onChange={handleChange}
                                                       fullWidth={true} multiline rows={3} rowsMax={3} variant="outlined"
                                                       error={errors.rootCaseOfAccident && touched.rootCaseOfAccident}
                                                       helperText={errors.rootCaseOfAccident && touched.rootCaseOfAccident ? 'Rootcase is required' : ' '}
                                            />
                                            <TextField label="Description" name="descriptionOfIncident"
                                                       value={values.descriptionOfIncident} onChange={handleChange}
                                                       fullWidth={true} multiline rows={3} rowsMax={3} variant="outlined"
                                            />
                                            <br/>
                                            <TextField label="Name of Handler" name="nameOfHandler"
                                                       value={values.nameOfHandler} onChange={handleChange}
                                                       select fullWidth={true} variant="outlined"
                                            >
                                                {users.map(user => {
                                                    if (user.id !== currentUser.id)
                                                        return (
                                                            <MenuItem key={user.id} value={user.id}>
                                                                {user.fullName}
                                                            </MenuItem>)
                                                })}
                                            </TextField>
                                        </Grid>
                                        <DialogActions style={styles.dialogAction}>
                                            <Button type="button" onClick={this.handleClose}>cancel</Button>
                                            <Button type="submit" variant="outlined" color="primary"
                                                    disabled={isSubmitting}>Save</Button>
                                        </DialogActions>
                                    </form>
                                )
                            }}
                        </Formik>
                    </DialogContent>
                </Dialog>
                </MuiPickersUtilsProvider>
            </div>
        );
    }
}

export default EditIncidentDialog
