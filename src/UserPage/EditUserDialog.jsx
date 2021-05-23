import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Snackbar,
    TextField
} from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';
import {userService} from "@/_services";
import {Alert} from "@material-ui/lab";

class EditUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            isError: false,
            isCreate: true,
            open: false,
            showSuccess: false,
            showError: false
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessSnackbarOpen = this.handleSuccessSnackbarOpen.bind(this);
        this.handlSnackbarClose = this.handlSnackbarClose.bind(this);
        this.handleErrorSnackbarOpen = this.handleErrorSnackbarOpen.bind(this);
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
    }

    handleErrorSnackbarOpen() {
        this.setState({showError: true});
    }

    handlSnackbarClose() {
        this.setState({showSuccess: false, showError: false});
    }

    render() {
        const {user, open, showSuccess, showError} = this.state;
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {user ? 'Edit' : 'Create New User'}
                </Button>

                <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title">{user ? 'Edit ' : 'Create New '} User</DialogTitle>
                    <DialogContent>
                        <Formik
                            onSubmit={(values) => {
                                const data = {
                                    id: '',
                                    fullName: values.fullName,
                                    email: values.email,
                                    role: values.role,
                                    password: values.password
                                };
                                if (user) {
                                    data.id = user.id;
                                    userService.update(data)
                                        .then(response => {
                                            if (response) {
                                                this.handleSuccessSnackbarOpen();
                                                this.handleClose();
                                            } else {
                                                this.handleErrorSnackbarOpen();
                                            }
                                        })
                                } else {
                                    userService.create(data)
                                        .then(response => {
                                            if (response) {
                                                this.handleSuccessSnackbarOpen();
                                                this.handleClose();
                                            } else {
                                                this.handleErrorSnackbarOpen();
                                            }
                                        })
                                }
                            }}
                            initialValues={{
                                fullName: user ? user.fullName : '',
                                email: user ? user.email : '',
                                role: user ? user.role : 'Admin',
                                password: ''
                            }}
                            validationSchema={Yup.object().shape({
                                fullName: Yup
                                    .string('Enter user name')
                                    .required('Name is required'),
                                role: Yup
                                    .string('Select user role')
                                    .required('Role is required'),
                                email: Yup
                                    .string('Enter user email')
                                    .email('Enter a valid email')
                                    .required('Email is required'),
                                password: !user ? Yup
                                    .string('Enter user password')
                                    .min(8, 'Password should be of minimum 8 characters length')
                                    .required('Password is required') : Yup.string(),
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
                                            <TextField label="Full Name" name="fullName" value={values.fullName}
                                                       onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.fullName && touched.fullName}
                                                       helperText={errors.fullName && touched.fullName ? 'Name is required' : ' '}
                                            />
                                            <TextField label="Email" name="email" value={values.email}
                                                       onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.email && touched.email}
                                                       helperText={errors.email && touched.email ? 'Email is required' : ' '}
                                            />
                                            <TextField label="Role" name="role" value={values.role}
                                                       onChange={handleChange}
                                                       select fullWidth={true}
                                                       error={errors.role && touched.role}
                                                       helperText={errors.role && touched.role ? 'Email is required' : ' '}
                                            >
                                                <MenuItem key={"Admin"} value={"Admin"}>
                                                    Admin
                                                </MenuItem>
                                                <MenuItem key={"User"} value={"User"}>
                                                    User
                                                </MenuItem>
                                            </TextField>
                                            {!user &&
                                            <TextField label="Password" name="password" value={values.password}
                                                       onChange={handleChange}
                                                       type="password" fullWidth={true}
                                                       error={errors.password && touched.password}
                                                       helperText={errors.password && touched.password ? 'Password is required' : ' '}
                                            />}
                                        </Grid>
                                        <DialogActions>
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
                <Snackbar open={showSuccess} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="success">
                        {user ? 'User successfully updated.' : 'User successfully created.'}
                    </Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={6000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="error">
                        {user ? 'Failed to update user. Please try again.' : 'Failed to create user. Please try again.'}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default EditUserDialog
