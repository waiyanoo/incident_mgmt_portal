import React from 'react';
import {authenticationService} from '@/_services';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    TextField
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {green} from "@material-ui/core/colors";
import * as Yup from "yup";
import {Formik} from "formik";

const styles = {
    cardStyle: {
        marginTop: 20,
        width: 350,
    },
    alertPadding: {
        marginTop: 15
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
};

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

        this.state = {
            isError: false
        };
    }

    render() {
        const { isError } = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >

                    <Card style={styles.cardStyle}>
                        <CardContent>
                            <h2>Login</h2>
                            <Formik
                                onSubmit={(values, { setSubmitting }) => {
                                    setSubmitting(true)
                                    authenticationService.login(values.email, values.password)
                                        .then(
                                            () => {
                                                const {from} = this.props.location.state || {from: {pathname: "/"}};
                                                this.props.history.push(from);
                                            },
                                            _error => {
                                                setSubmitting(false);
                                                this.setState({isError: true})
                                            }
                                        );

                                }}
                                initialValues={{
                                    email: '',
                                    password: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup
                                        .string('Enter username')
                                        .email('Enter a valid email')
                                        .required('Username is required'),
                                    password: Yup
                                        .string('Enter password')
                                        .required('Password is required')
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
                                                alignItems="stretch"
                                            >
                                                <TextField label="Email" name="email" value={values.email}
                                                           onChange={handleChange}
                                                           type="text" variant="outlined"
                                                           error={errors.email && touched.email}
                                                           helperText={errors.email && touched.email ? 'Email is invalid' : ' '}
                                                />
                                                <TextField label="Password" name="password" value={values.password}
                                                           onChange={handleChange}
                                                           type="password" variant="outlined"
                                                           error={errors.password && touched.password}
                                                           helperText={errors.password && touched.password ? 'Password is invalid' : ' '}
                                                />
                                                <Button type="submit" variant="outlined" color="primary"
                                                        disabled={isSubmitting}>LOGIN</Button>
                                                {isSubmitting && <CircularProgress size={24} style={styles.buttonProgress}/>
                                                }
                                                {isError &&
                                                <Alert style={styles.alertPadding} severity="error">Email or password is
                                                    incorrect!</Alert>}
                                            </Grid>


                                        </form>
                                    )
                                }}
                            </Formik>
                        </CardContent>
                    </Card>
                </Grid>

            </Container>
        )
    }
}

export {LoginPage};
