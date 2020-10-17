import React, {useEffect} from 'react';
import * as ROUTES from "../constants/routes";
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import AuthUserContext from "./SessionContext";


const withPermissions = condition => Component => {
    const PermissionsContext = (props) => {
        const history = useHistory();
        useEffect(() => {
            const listener = props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        history.push(ROUTES.HOME);
                    }
                },
                () => {
                    history.push(ROUTES.SIGN_IN);
                }
            );

            return () => {
                listener();
            }
        });

        return (
            <AuthUserContext.Consumer>
                {authUser => condition(authUser) ? <Component {...props} /> : null
                }
            </AuthUserContext.Consumer>
        )
    }
    return withFirebase(PermissionsContext);
}

export default withPermissions;
