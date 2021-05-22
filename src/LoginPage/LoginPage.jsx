import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { authenticationService } from '@/_services';
import {Button, Card, CardContent, Grid, TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

const styles = {
    cardStyle : {
        width: 350,
    },
    alertPadding: {
        marginTop: 15
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
            username: '',
            password: '',
            submitted: false,
            isError: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        authenticationService.login(username, password)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                },
                error => {
                    this.setState({password: '', isError : true})
                }
            );

    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted, isError } = this.state;
        return (
            <div>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Card style={styles.cardStyle}>
                        <CardContent>
                            <h2>Login</h2>
                            <form noValidate autoComplete="off"  onSubmit={this.handleSubmit}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    <TextField label="Email" name="username" value={username} onChange={this.handleChange}
                                               type="email"
                                               error={submitted && !username}
                                               helperText={submitted && !username ? 'Email is required' : ' '}
                                    />
                                    <TextField label="Password" name="password" value={password} onChange={this.handleChange}
                                               type="password"
                                               error={submitted && !password}
                                               helperText={submitted && !password ? 'Password is required' : ' '}
                                    />
                                    <Button variant="contained" type="submit" color="primary">
                                        Login
                                    </Button>
                                    {loggingIn &&
                                    <img alt="img" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    }
                                    {isError &&
                                    <Alert style={styles.alertPadding} severity="error">Email or password is incorrect!</Alert>}
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

            </div>
        )
    }
}

export { LoginPage };
