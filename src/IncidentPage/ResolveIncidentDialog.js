import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from "@material-ui/core";
import * as Yup from "yup";
import {Formik} from "formik";

const styles = {
    dialogAction: {
        paddingRight: 0
    }
}

class ResolveIncidentDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            incident: this.props.incident ? this.props.incident : null,
            open: this.props.open ? this.props.open : false,
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClickOpen() {
        this.setState({open: true});
    };

    handleClose(e) {
        this.props.callbackModal(e);
        this.setState({open: false});
    };

    render() {
        const { open, incident } = this.state;
        return (
            <div>
                <Dialog open={open} onClose={this.handleClose} fullWidth={true} maxWidth={'sm'}>
                    <DialogTitle id="form-dialog-title"> Resolve Incident</DialogTitle>
                    <DialogContent>
                        <Formik
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                let data = {id: incident.id, comment: values.comment};
                                this.handleClose({action: 'resolve', data});
                            }}
                            initialValues={{
                                comment: ''
                            }}
                            validationSchema={Yup.object().shape({
                                comment: Yup
                                    .string('Enter comment')
                                    .required('Name is required')
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
                                            alignItems="center"
                                        >
                                            <TextField label="Comment" name="comment" value={values.comment}
                                                       onChange={handleChange}
                                                       multiline variant="outlined"
                                                       rows={4} fullWidth={true}
                                                       error={errors.comment && touched.comment}
                                                       helperText={errors.comment && touched.comment ? 'Comment is required' : ' '}
                                            />

                                        </Grid>
                                        <DialogActions style={styles.dialogAction}>
                                            <Button type="button" onClick={this.handleClose}>cancel</Button>
                                            <Button type="submit" variant="outlined" color="primary"
                                                    disabled={isSubmitting}>Resolve</Button>
                                        </DialogActions>
                                    </form>
                                )
                            }}
                        </Formik>
                    </DialogContent>
                </Dialog>
            </div>
        )

    }
}

export default ResolveIncidentDialog;
