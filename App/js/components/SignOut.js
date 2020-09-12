import React from 'react';
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {IconButton} from "@material-ui/core";

const SignOut = (props) => {

    const history = useHistory();

    const handleClickSignOut = () => {
        history.push(ROUTES.HOME);
        props.firebase.signOut();
    };

    return (
        <IconButton onClick={handleClickSignOut}>
          <MeetingRoomIcon/>  Logout
        </IconButton>
    );
};

export default withFirebase(SignOut);
