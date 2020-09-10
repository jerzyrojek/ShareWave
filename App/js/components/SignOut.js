import React from 'react';
import {withFirebase} from "./Firebase/context";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";

const SignOut = (props) => {

    const history = useHistory();

    const handleClickSignOut = () => {
        history.push(ROUTES.HOME);
        props.firebase.signOut();
    };

    return (
        <Button onClick={handleClickSignOut}>
            Sign Out
        </Button>
    );
};

export default withFirebase(SignOut);
