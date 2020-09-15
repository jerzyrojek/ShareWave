import React from 'react';
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const SignOut = (props) => {

    const history = useHistory();

    const handleClickSignOut = () => {
        history.push(ROUTES.HOME);
        props.firebase.signOut();
    };

    return (
        <button style={{outline:"none", border:"0", display:"flex", alignItems:"center", backgroundColor:"#263238", padding:"0", fontSize:"1.3rem"}} onClick={handleClickSignOut}>
          <MeetingRoomIcon/>  Logout
        </button>
    );
};

export default withFirebase(SignOut);
