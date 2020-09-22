import React, {useEffect} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import AuthUserContext from "./SessionContext";
import Button from "@material-ui/core/Button";

const UserAccountPage = () => {

    useEffect(() => {

    },[])

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div className="user__details container">
                    <Typography variant="h3">User Page</Typography>
                    <Typography variant="h5">Display name: {authUser.displayName}</Typography>
                    <Typography variant="h5">Email: {authUser.email}</Typography>
                    <Button>Change Password</Button>
                </div>
            )}
        </AuthUserContext.Consumer>
    );
};

const condition = authUSer => !!authUSer;

export default PermissionsContext(condition)(UserAccountPage);
