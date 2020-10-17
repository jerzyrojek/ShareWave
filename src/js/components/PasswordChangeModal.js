import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from "@material-ui/core/Button";
import PasswordChangeForm from "./PasswordChangeForm";
import {withFirebase} from "./Firebase/context";
import Tooltip from "@material-ui/core/Tooltip";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        outline: "none",
    },
}));

const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: "#f44336",
        fontSize: "1rem",
        color: "white",
    },
    arrow: {
        color: "#f44336",
    }
})(Tooltip);


const PasswordChangeModal = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const provider = props.firebase.auth.currentUser.providerData[0].providerId;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {provider === "google.com" ?
                <CustomTooltip TransitionComponent={Fade} TransitionProps={{timeout: 600}}
                               title="Not available for Google Sign in" arrow>
                    <span><Button disabled variant="contained">Change Password</Button></span>
                </CustomTooltip>
                :
                <Button onClick={handleOpen} color="secondary" variant="contained">Change Password</Button>
            }

            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <PasswordChangeForm close={handleClose}/>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default withFirebase(PasswordChangeModal);
