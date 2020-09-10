import React from 'react';
import {Toolbar} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import * as ROUTES from "../constants/routes";
import {Link} from "react-router-dom";
import SignOut from "./Firebase/SignOut";
import AuthUserContext from "./SessionContext";

const Navbar = () => (
    <>
        <AppBar positon="sticky">
            <Toolbar>
                <div>
                    <AuthUserContext.Consumer>
                        {authUser => authUser ? <NavbarAuthorized/> : <NavbarNonAuthorized/>}
                    </AuthUserContext.Consumer>

                </div>
            </Toolbar>
        </AppBar>
        <Toolbar/>
        </>
);



const NavbarAuthorized = () => {
    return (
        <ul>
            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
                <SignOut/>
            </li>
        </ul>
    );
};


const NavbarNonAuthorized = () => {
    return (
        <ul>
            <li >
                <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            </li>

            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>

            <li>
                <Link to={ROUTES.SIGN_UP}>Sign up</Link>
            </li>
        </ul>
    );
};


export default Navbar;
