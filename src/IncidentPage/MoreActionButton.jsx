import React from "react";
import {
    Button,
    IconButton,
    Menu,
    MenuItem, Snackbar,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {authenticationService, incidentService} from "@/_services";
import ViewIncidentDialog from "@/IncidentPage/ViewIncidentDialog";
import EditIncidentDialog from "@/IncidentPage/EditIncidentDialog";
import AcknowledgedIncidentDialog from "@/IncidentPage/AcknowledgedIncidentDialog";
import ResolveIncidentDialog from "@/IncidentPage/ResolveIncidentDialog";
import {Alert} from "@material-ui/lab";

class MoreActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authenticationService.currentUserValue,
            incident: this.props.incident ? this.props.incident : null,
            incidentTypes: this.props.incidentTypes,
            users: this.props.users ? this.props.users : [],
            anchorEl: false,
            openView: false,
            openEdit: false,
            openAcknowledge: false,
            openResolve: false,
            showSuccess: false,
            showError: false,
            messsage: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleAcknowledgeOpen = this.handleAcknowledgeOpen.bind(this);
        this.handleResolveOpen = this.handleResolveOpen.bind(this);
        this.callbackModal = this.callbackModal.bind(this);
        this.handleEditCallBackModal = this.handleEditCallBackModal.bind(this);
        this.handleAcknowledgeCallBackModal = this.handleAcknowledgeCallBackModal.bind(this);
        this.handleResolveCallBackModal = this.handleResolveCallBackModal.bind(this);
        this.handleSuccessSnackbarOpen = this.handleSuccessSnackbarOpen.bind(this);
        this.handlSnackbarClose = this.handlSnackbarClose.bind(this);
        this.handleErrorSnackbarOpen = this.handleErrorSnackbarOpen.bind(this);
    }



    handleClick(event){
        this.setState({anchorEl : event.currentTarget});
    };

    handleClose(){
        this.setState({anchorEl : null});
    };

    handleViewOpen(){
        this.setState({openView: true});
        this.handleClose();
    }

    handleEditOpen(){
        this.setState({openEdit: true});
        this.handleClose();
    }

    handleAcknowledgeOpen(){
        this.setState({openAcknowledge: true});
        this.handleClose();
    }

    handleResolveOpen(){
        this.setState({openResolve: true});
        this.handleClose();
    }


    handleSuccessSnackbarOpen(message) {
        this.setState({showSuccess: true, message});
    }

    handleErrorSnackbarOpen(message) {
        this.setState({showError: true, message});
    }

    handlSnackbarClose() {
        this.setState({showSuccess: false, showError: false});
    }

    handleEditCallBackModal(e){
        if(e.action === 'edit'){
            this.editIncident(e.data);
        } else if (e.action === 'create'){
            this.createIncident(e.data);
        } else {
            this.callbackModal();
        }
    }

    handleAcknowledgeCallBackModal(e) {
        if(e.action === 'acknowledge'){
            this.acknowledgeIncident();
        } else {
            this.callbackModal();
        }
    }

    handleResolveCallBackModal(e) {
        if(e.action === 'resolve'){
            this.resolveIncident(e.data);
        } else {
            this.callbackModal();
        }
    }

    callbackModal() {
        this.setState({
            openView: false,
            openEdit: false,
            openAcknowledge: false,
            openResolve: false});
        this.props.callbackModal();
    }

    editIncident(data){
        incidentService.update(data)
            .then(response => {
                if (response) {
                    this.setState({incident: response.data});
                    this.handleSuccessSnackbarOpen('Incident successfully updated.');
                } else {
                    this.handleErrorSnackbarOpen('Failed to update Incident. Please try again.');
                }
            })
            .catch(() => {
                this.handleErrorSnackbarOpen('Failed to update Incident. Please try again.');
            })
            .finally(() => this.callbackModal());
    }

    createIncident(data){
        incidentService.create(data)
            .then(response => {
                if (response) {
                    this.handleSuccessSnackbarOpen('Incident successfully created.');
                } else {
                    this.handleErrorSnackbarOpen('Failed to create Incident. Please try again.');
                }
            })
            .catch(() => {
                this.handleErrorSnackbarOpen('Failed to create Incident. Please try again.');
            })
            .finally(() => this.callbackModal());
    }

    acknowledgeIncident(){
        const {incident} = this.state;
        incidentService.acknowledge(incident.id)
            .then(response => {
                if (response) {
                    this.handleSuccessSnackbarOpen('acknowledge successfully.');
                } else {
                    this.handleErrorSnackbarOpen('Failed to acknowledge.');
                }
            })
            .catch(() => {
                this.handleErrorSnackbarOpen('Failed to acknowledge.');
            })
            .finally(() => this.callbackModal());
    }

    resolveIncident(data) {
        incidentService.resolve(data)
            .then(response => {
                if (response) {
                    this.handleSuccessSnackbarOpen('Resolve successfully.');
                } else {
                    this.handleErrorSnackbarOpen('Failed to resolve');
                }
            })
            .catch(() => {
                this.handleErrorSnackbarOpen('Failed to resolve');
            })
            .finally(() => this.callbackModal());
    }

    render() {
        const {anchorEl, incident, currentUser, users, incidentTypes, openView, openEdit, openAcknowledge, openResolve, showSuccess, showError, message } = this.state;
        return (
            <div>
                {incident === null && <Button size="small" variant="outlined" color="primary" onClick={this.handleEditOpen}>
                    Create New Incident
                </Button>}
                {incident && <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleViewOpen}>View</MenuItem>
                        {incident.nameOfHandler === '' && currentUser.role === 'Admin' && <MenuItem onClick={this.handleEditOpen}>Edit</MenuItem>}
                        {!incident.isResolved && !incident.isAcknowledged && incident.nameOfHandler === currentUser.id && <MenuItem onClick={this.handleAcknowledgeOpen}>Acknowledge</MenuItem>}
                        {!incident.isResolved && incident.isAcknowledged && incident.nameOfHandler === currentUser.id && <MenuItem onClick={this.handleResolveOpen}>Resolve</MenuItem>}
                    </Menu>
                </div>}

                {openView && <ViewIncidentDialog incident={incident} incidentTypes={incidentTypes} users={users} open={openView} callbackModal={this.callbackModal} />}
                {openEdit && <EditIncidentDialog open={openEdit} users={users} incident={incident} incidentTypes={incidentTypes} callbackModal={this.handleEditCallBackModal}/>}
                {openAcknowledge && <AcknowledgedIncidentDialog open={openAcknowledge} incident={incident} callbackModal={this.handleAcknowledgeCallBackModal}/>}
                {openResolve && <ResolveIncidentDialog open={openResolve} incident={incident} callbackModal={this.handleResolveCallBackModal}/>}
                <Snackbar open={showSuccess} autoHideDuration={1000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="success">
                        {message}
                    </Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={1000} onClose={this.handlSnackbarClose}>
                    <Alert onClose={this.handlSnackbarClose} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
            </div>
        )

    }
}

export default MoreActionButton;
