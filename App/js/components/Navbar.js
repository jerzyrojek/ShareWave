import React, {useContext} from 'react';
import {Toolbar} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import * as ROUTES from "../constants/routes";
import {Link} from "react-router-dom";
import SignOut from "./SignOut";
import AuthUserContext from "./SessionContext";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import FileUploadModal from "./FileUploadModal";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import {SidebarContext} from "../App";
import ProfileMenu from "./ProfileMenu";
import Hidden from "@material-ui/core/Hidden";


const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    toolBar: {
        minHeight: "64px"
    },
    sidebarButton: {
        marginRight: theme.spacing(0),
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        }
    }
}));

const Navbar = () => {
    const classes = useStyles();
    const {sidebarOpen, setSidebarState} = useContext(SidebarContext);

    return (
        <>
            <AppBar className={classes.appBar} positon="fixed">
                <Toolbar className={classes.toolBar}>
                    <IconButton
                        color="inherit"
                        aria-label="Open sidebar"
                        edge="start"
                        className={classes.sidebarButton}
                        onClick={setSidebarState}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <div className="app__navbar">
                        <div className="app__logo">
                            <Link to={ROUTES.HOME}>
                                <Typography variant="h5" color="secondary"><span>Share</span>Wave</Typography>
                                <img alt="logo" src="../../assets/logo.png"/>
                            </Link>
                        </div>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? <NavbarAuthorized authUser={authUser}/> : <NavbarNonAuthorized/>}
                        </AuthUserContext.Consumer>

                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar className={classes.toolBar}/>
        </>
    )
};


const NavbarAuthorized = ({authUser}) => {
    return (
        <div className="app__menu">
            <FileUploadModal/>
            <Hidden smDown implementation="js">
                {authUser.role === "admin" &&
                <Link to={ROUTES.ADMIN}>Admin</Link>
                }
                <Link to={ROUTES.ACCOUNT}>Account</Link>
                <SignOut/>
            </Hidden>
            <ProfileMenu currentUser={authUser}/>
        </div>
    );
};


const NavbarNonAuthorized = () => {
    return (
        <div>
            <Link to={ROUTES.SIGN_IN}>Sign in</Link>
            <Link to={ROUTES.SIGN_UP}>Sign up</Link>
        </div>
    );
};


export default Navbar;
