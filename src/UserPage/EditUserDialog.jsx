import React from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, MenuItem, TextField
} from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';

class EditUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            isError: false,
            isCreate: true,
            open: false
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen(){
        this.setState({open: true})
    };

    handleClose(){
        this.setState({open: false})
    };

    render() {
        const { user, open } = this.state;

       return (
            <div>
                    <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                        {user ? 'Edit':  'Create New User'}
                    </Button>

                        <Dialog open={open} onClose={this.handleClose}  fullWidth={true} maxWidth={'sm'}>
                        <DialogTitle id="form-dialog-title">Create New User</DialogTitle>
                        <DialogContent>
                            <Formik
                                onSubmit={(values, { setSubmitting }) => {
                                    if(user){
                                        alert('update');
                                    } else {
                                        alert('create');
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
                                    password: Yup
                                        .string('Enter user password')
                                        .min(8, 'Password should be of minimum 8 characters length')
                                        .required('Password is required'),
                                })}
                                >
                                { props => { const {
                                    values, touched, errors, isSubmitting, handleChange, handleSubmit, handleReset
                                } = props;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Grid
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <TextField label="Full Name" name="fullName" value={values.fullName} onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.fullName && touched.fullName}
                                                       helperText={errors.fullName && touched.fullName ? 'Name is required' : ' '}
                                            />
                                            <TextField label="Email" name="email" value={values.email} onChange={handleChange}
                                                       type="text" fullWidth={true}
                                                       error={errors.email && touched.email}
                                                       helperText={errors.email && touched.email ? 'Email is required' : ' '}
                                            />
                                            <TextField label="Role" name="role" value={values.role} onChange={handleChange}
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
                                            <TextField label="Password" name="password" value={values.password} onChange={handleChange}
                                                       type="password" fullWidth={true}
                                                       error={errors.password && touched.password}
                                                       helperText={errors.password && touched.password ? 'Password is required' : ' '}
                                            />
                                        </Grid>
                                        <DialogActions>
                                            <Button type="button" onClick={handleReset}>Rest</Button>
                                            <Button type="submit" variant="outlined"  disabled={isSubmitting}>Save</Button>
                                        </DialogActions>
                                    </form>
                                )}}
                            </Formik>
                        </DialogContent>
                    </Dialog>
                </div>
        );
    }
}

export default EditUserDialog
