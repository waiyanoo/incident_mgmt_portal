import React from 'react';

import {authenticationService, incidentService, userService} from '@/_services';
import {Card, CardContent, Container, Grid, Typography} from "@material-ui/core";

const styles = {
    root: {
        width: 350,
        minHeight: 160,
        height: 200
    },
    grid: {
        paddingTop: 20,
        paddingBottom: 20
    }
}

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            incidents: [],
            users: [],
            userCount: 0,
            adminCount: 0
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        if(currentUser.role === 'Admin'){
            userService.getAll().then(users => this.setState({users: users.data}));
        }

        incidentService.getAll().then(incidents => this.setState({incidents: incidents.data}));
    }

    render() {
        const {currentUser, users, incidents} = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                    style={styles.grid}
                >
                    <Grid item>
                        {incidents.length > 0 &&<Card style={styles.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Incident Overview <br/> <br/>
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Typography  variant="body2" component="p">
                                        Total Number of Incidents :<span>&nbsp;&nbsp;</span>
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        { incidents.length}
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Typography  variant="body2" component="p">
                                        Number of Resolved : <span>&nbsp;&nbsp;</span>
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        { incidents.filter(incident => incident.isResolved).length}
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Typography  variant="body2" component="p">
                                        Number of Acknowledged : <span>&nbsp;&nbsp;</span>
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        { incidents.filter(incident => incident.isAcknowledged && !incident.isResolved).length}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>}
                    </Grid>
                    <Grid item>
                        {users.length > 0 && currentUser.role === 'Admin' &&<Card style={styles.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    User Overview  <br/> <br/>
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Typography  variant="body2" component="p">
                                        Number of Admin :<span>&nbsp;&nbsp;</span>
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        { users.filter(user => user.role === 'Admin').length}
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Typography  variant="body2" component="p">
                                        Number of User : <span>&nbsp;&nbsp;</span>
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        { users.filter(user => user.role === 'User').length}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>}
                    </Grid>

                </Grid>
            </Container>
        );
    }
}

export {HomePage};
