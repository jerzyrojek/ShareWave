import React from 'react';
import {withFirebase} from "./context";
import Button from "@material-ui/core/Button";

const SignOut = (props) => {
    return (
        <Button onClick={props.firebase.signOut}>
            Sign Out
        </Button>
    );
};

export default withFirebase(SignOut);
