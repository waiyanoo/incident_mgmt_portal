import React from 'react';
import {
    Button,
    Dialog,DialogContent,
    DialogTitle, FormControl, Grid, InputLabel,
     Select, TextField
} from "@material-ui/core";
import {userService} from "@/_services";
import { useFormik } from 'formik';
import * as yup from 'yup';


const styles = {
    formControl: {
        width: '100%',
        marginBottom: 15
    },
    selectEmpty: {
        marginTop: 10,
    },
};

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

class EditUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            id: '',
            fullName: '',
            email: '',
            role: '',
            password: '',
            submitted: false,
            isError: false,
            isCreate: true,
            open: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen(){
        this.setState({open: true})
    };

    handleClose(){
        this.setState({open: false})
    };

    handleSubmit(e){
        e.preventDefault();
        this.setState({submitted: true});
        const {id, fullName, email, role, password, isCreate} = this.state;
        if(fullName && email && password){
            if(isCreate){
                userService.create({fullName, email, role, password})
                    .then(user => {

                    })
            } else{
                userService.update({id, fullName, email, role, password})
                    .then(user => {

                    })
            }
        }

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }


    render() {
        const { user,id, fullName, email, role, password, submitted, isError, isCreate, open } = this.state;
             return (
            <div>
                    <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                        Create New User
                    </Button>

                        <Dialog open={open} onClose={this.handleClose}  fullWidth={true} maxWidth={'sm'}>
                        <DialogTitle id="form-dialog-title">Create New User</DialogTitle>
                        <DialogContent>
                            <form noValidate autoComplete="off"  onSubmit={this.handleSubmit}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <TextField label="Full Name" name="fullName" value={fullName} onChange={this.handleChange}
                                               type="text" fullWidth={true}
                                               error={submitted && !fullName}
                                               helperText={submitted && !fullName ? 'Name is required' : ' '}
                                    />
                                    <TextField label="Email" name="email" value={email} onChange={this.handleChange}
                                               type="text" fullWidth={true}
                                               error={submitted && !email}
                                               helperText={submitted && !email ? 'Email is required' : ' '}
                                    />
                                    <FormControl style={styles.formControl}>
                                        <InputLabel htmlFor="age-native-simple">Role</InputLabel>
                                        <Select
                                            native
                                            value={role}
                                            onChange={this.handleChange}
                                            inputProps={{
                                                name: 'role',
                                                id: 'age-native-simple',
                                            }}
                                        >
                                            <option value={'Admin'}>Admin</option>
                                            <option value={'User'}>User</option>
                                        </Select>
                                    </FormControl>
                                    <TextField label="Password" name="password" value={password} onChange={this.handleChange}
                                               type="password" fullWidth={true}
                                               error={submitted && !password}
                                               helperText={submitted && !password ? 'Password is required' : ' '}
                                    />

                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="center"
                                >
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button variant="contained" type="submit" color="primary" >
                                        {isCreate ? 'Create' : 'Update'}
                                    </Button>
                                </Grid>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
        );
    }
}

export default EditUserDialog
