import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        margin: "1rem auto",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding: "0.5rem",
        boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.3)",
        backgroundColor:"white",
        textAlign:"center",
        [theme.breakpoints.up("sm")]: {
            width: "600px",
            height:"500px",
            position:"absolute",
            top:"50%",
            left:"50%",
            transform:"translate(-50%,-50%)",
        }

    },
    element: {
      marginBottom:"1rem",
    },
    image: {
        width: "250px",
        objectFit: "contain",
    },

}))

const NotFoundPage = () => {
    const classes = useStyles();
    const history = useHistory();

    const handleRouteHome = () => {
        history.push(`/`);
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.element} variant="h3">Page not found</Typography>
            <img className={classes.image} alt="not found icon" src="../../assets/notfound.png"/>
            <Typography className={classes.element} variant="h4">Oops! Looks like the <span>(Share)Waves</span> took you too far!</Typography>
            <Button className={classes.element} onClick={handleRouteHome} variant="contained" color="secondary">Go back to safe waters</Button>
        </div>
    );
};

export default NotFoundPage;
