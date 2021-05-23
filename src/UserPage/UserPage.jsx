import React from 'react';
import {userService} from '@/_services';
import {
    Container,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import EditUserDialog from "@/UserPage/EditUserDialog";

class UserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };

        const { history } = this.props;

        console.log(history)
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    editHandler(id){
        this.props.history.push(`/user/${id}`);
    }

    createNewHandler(){
        this.props.history.push(`/createuser`);
    }

    render() {
        const { users } = this.state;
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <h2>User</h2>
                    <EditUserDialog/>
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
                                        <EditUserDialog user={row}/>

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

export { UserPage };

