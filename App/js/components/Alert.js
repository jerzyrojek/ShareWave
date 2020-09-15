import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));


const AlertComponent = ({type, message, runAlert ,...props}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(runAlert);


    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return setOpen(false);
        }

        setOpen(false);
    };
    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AlertComponent;
