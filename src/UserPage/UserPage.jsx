import React from 'react';
import {userService} from '@/_services';
import {
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import EditUserDialog from "@/UserPage/EditUserDialog";

class UserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
        this.callbackModal = this.callbackModal.bind(this);
    }

    componentDidMount() {
        this.retrieveUsers();
    }

    callbackModal() {
        this.retrieveUsers();
    }

    retrieveUsers() {
        userService.getAll().then(users => this.setState({users: users.data}));
    }

    render() {
        const {users} = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <h2>User</h2>
                    <EditUserDialog callbackModal={this.callbackModal}/>
                </Grid>

                {users &&
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Full name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">Active</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.fullName}
                                    </TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.role}</TableCell>
                                    <TableCell align="left">{row.isActive ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="right">
                                        <EditUserDialog user={row} callbackModal={this.callbackModal}/>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </Container>
        );
    }
}

export {UserPage};

