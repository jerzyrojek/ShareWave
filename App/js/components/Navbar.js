import React from 'react';
import {Toolbar} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import * as ROUTES from "../constants/routes";
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <AppBar positon="sticky">
                <Toolbar>
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
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </>
    );
};

export default Navbar;
