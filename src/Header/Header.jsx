import React from 'react';
import {AppBar, Container, List, ListItem, ListItemText, withStyles} from "@material-ui/core";
import {authenticationService} from "@/_services";
import {Role} from "@/_helpers";

const styles = () => ({
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
    },
    navDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
    },
    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `white`
    }
});

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout();
    }

    render() {
        const {classes} = this.props;
        const {currentUser, isAdmin} = this.state;
        return (
            <div>
                {currentUser &&
                <AppBar position="static">
                    <Container className={classes.navbarDisplayFlex}>
                        <List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
                            <a href={'/'} key={'Home'} className={classes.linkText}>
                                <ListItem button>
                                    <ListItemText primary={'home'}/>
                                </ListItem>
                            </a>
                            <a href={'/incident'} key={'Incident'} className={classes.linkText}>
                                <ListItem button>
                                    <ListItemText primary={'incident'}/>
                                </ListItem>
                            </a>
                            {isAdmin && <a href={'/user'} key={'user'} className={classes.linkText}>
                                <ListItem button>
                                    <ListItemText primary={'user'}/>
                                </ListItem>
                            </a>}
                            <a href={'/login'} onClick={this.logout} key={'Logout'} className={classes.linkText}>
                                <ListItem button>
                                    <ListItemText primary={'Logout'}/>
                                </ListItem>
                            </a>
                        </List>
                    </Container>
                </AppBar>
                }
            </div>
        );
    }
}

export default withStyles(styles)(Header)
