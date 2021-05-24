import React from 'react';
import {Route, Router} from 'react-router-dom';
import {history, Role} from '@/_helpers';
import {authenticationService} from '@/_services';
import {PrivateRoute} from '@/_components';
import {HomePage} from '@/HomePage';
import {LoginPage} from '@/LoginPage';
import Header from "@/Header/Header";
import {UserPage} from "@/UserPage";
import {IncidentPage} from "@/IncidentPage";

class App extends React.Component {
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

    render() {
        return (
            <Router history={history}>
                <div>
                    <Header/>
                    <PrivateRoute exact path="/" component={HomePage}/>
                    <PrivateRoute exact path="/user" roles={[Role.Admin]} component={UserPage}/>
                    <PrivateRoute path="/incident" component={IncidentPage}/>
                    <Route path="/login" component={LoginPage}/>
                </div>
            </Router>
        );
    }
}

export {App};
