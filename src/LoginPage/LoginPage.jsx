import React from 'react';
import {authenticationService} from '@/_services';
import {Button, Card, CardContent, CircularProgress, Grid, TextField} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {green} from "@material-ui/core/colors";

const styles = {
    cardStyle: {
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
            username: '',
            password: '',
            submitted: false,
            isError: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password} = this.state;
        authenticationService.login(username, password)
            .then(
                () => {
                    const {from} = this.props.location.state || {from: {pathname: "/"}};
                    this.props.history.push(from);
                },
                _error => {
                    this.setState({password: '', isError: true})
                }
            );

    }

    render() {
        const {loggingIn} = this.props;
        const {username, password, submitted, isError} = this.state;
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
                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    <TextField label="Email" name="username" value={username}
                                               onChange={this.handleChange}
                                               type="email" variant="outlined"
                                               error={submitted && !username}
                                               helperText={submitted && !username ? 'Email is required' : ' '}
                                    />
                                    <TextField label="Password" name="password" value={password}
                                               onChange={this.handleChange}
                                               type="password" variant="outlined"
                                               error={submitted && !password}
                                               helperText={submitted && !password ? 'Password is required' : ' '}
                                    />
                                    <Button variant="contained" type="submit" color="primary">
                                        Login
                                    </Button>
                                    {loggingIn && <CircularProgress size={24} className={styles.buttonProgress}/>
                                    }
                                    {isError &&
                                    <Alert style={styles.alertPadding} severity="error">Email or password is
                                        incorrect!</Alert>}
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

            </div>
        )
    }
}

export {LoginPage};
