import React from 'react';
import {Toolbar} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import * as ROUTES from "../constants/routes";
import {Link} from "react-router-dom";
import SignOut from "./SignOut";
import AuthUserContext from "./SessionContext";
import Typography from "@material-ui/core/Typography";
import HomeIcon from '@material-ui/icons/Home';
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

const Navbar = () => {
    const classes = useStyles();
    return (
        <>
            <AppBar className={classes.appBar} positon="sticky">
                <Toolbar>
                    <div className="app__navbar">
                        <div>
                            <Typography variant="h5" color="secondary"><span>Share</span>Wave</Typography>
                            <img alt="logo" src="../../assets/logo.png"/>
                        </div>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? <NavbarAuthorized/> : <NavbarNonAuthorized/>}
                        </AuthUserContext.Consumer>

                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </>
    )
};


const NavbarAuthorized = () => {
    return (
        <div>
            <Link color="secondary" to={ROUTES.HOME}><IconButton><HomeIcon/>Home</IconButton></Link>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
            <SignOut/>
        </div>
    );
};


const NavbarNonAuthorized = () => {
    return (
        <div>
            <Link color="secondary" to={ROUTES.HOME}><IconButton><HomeIcon/>Home</IconButton></Link>
            <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            <Link to={ROUTES.SIGN_UP}>Sign up</Link>
        </div>
    );
};


export default Navbar;
