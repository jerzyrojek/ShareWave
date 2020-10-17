import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignOut from "./SignOut";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        [theme.breakpoints.up('md')]: {
            display: 'none',
        }
    },
    menuButton: {
        "&:hover": {
            backgroundColor: "rgba(33, 150, 243, 0.04)",
        },
        padding: "0.5rem",
        marginRight: theme.spacing(0),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        }
    },
    icon: {
        "&:hover": {
            color: "#2196f3",
        },
    }
}));

const ProfileMenu = ({currentUser}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    className={classes.menuButton}
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle className={classes.icon}/>
                </IconButton>
                <Menu
                    className="app__menu-mobile"
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    {currentUser.role === "admin" &&
                    <MenuItem onClick={handleClose}><Link to={ROUTES.ADMIN}>Admin</Link></MenuItem>
                    }
                    <MenuItem onClick={handleClose}><Link to={ROUTES.ACCOUNT}>Account</Link></MenuItem>
                    <MenuItem onClick={handleClose}> <SignOut/></MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export default ProfileMenu;