import React from 'react';
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        outline: "none",
        border: "0",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#263238",
        padding: "0 0.5rem",
        fontSize: "1.3rem"
    }
}))

const SignOut = (props) => {

    const classes = useStyles();
    const history = useHistory();

    const handleClickSignOut = () => {
        history.push(ROUTES.HOME);
        props.firebase.signOut();
    };

    return (
        <button className={classes.button} onClick={handleClickSignOut}>
            <MeetingRoomIcon/> Logout
        </button>
    );
};

export default withFirebase(SignOut);
