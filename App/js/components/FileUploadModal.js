import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import FileUpload from "./FileUpload";

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
    modalButton: {
        [theme.breakpoints.down('xs')]: {
            padding: '0',
        },
        outline: "none",
        border: "0",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#263238",
        padding: "0 0.5rem",
        fontSize: "1.3rem",
    }
}));


const FileUploadModal = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <button className={classes.modalButton} onClick={handleOpen}><AddBoxRoundedIcon/>Upload</button>
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
                        <FileUpload close={handleClose}/>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default FileUploadModal;
