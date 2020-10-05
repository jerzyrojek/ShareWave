import React, {useContext} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CategorySuggestionForm from "./CategorySuggestionForm";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import AuthUserContext from "./SessionContext";
import * as ROUTES from "../constants/routes";
import {useHistory} from "react-router-dom";


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

const CategorySuggestionModal = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const currentUser = useContext(AuthUserContext);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const redirect = () => {
        history.push(ROUTES.SIGN_IN)
    }

    return (
        <>
            {currentUser ? <ListItem button onClick={handleOpen}>
                <ListItemIcon><AddBoxRoundedIcon/></ListItemIcon>
                <ListItemText primary="Suggest a category"/>
            </ListItem>
            :
                <ListItem button onClick={redirect}>
                    <ListItemIcon><AddBoxRoundedIcon/></ListItemIcon>
                    <ListItemText primary="Suggest a category"/>
                </ListItem>
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
                        <CategorySuggestionForm close={handleClose}/>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default CategorySuggestionModal;

