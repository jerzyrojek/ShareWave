import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import app from "firebase/app";



const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/featured/?video%20games)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const SignInPage = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const googleProvider = new app.auth.GoogleAuthProvider();
    const initialState = {
        email: "",
        password: "",
        error: ""
    }
    const [signInInfo, setSignInInfo] = useState({...initialState});

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = signInInfo;
        props.firebase.signInEmailAndPassword(email, password)
            .then(() => {
                setSignInInfo({...initialState});
                history.push(ROUTES.HOME);
            }).catch(err => {
            console.log(err);
        });
    }

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setSignInInfo((prev) => {
            return {...prev, [name]: value};
        });
    };

    const handleGoogleSignIn = () => {
        props.firebase.signInWithPopupUsingProvider(googleProvider).then(() => {
            history.push(ROUTES.HOME);
        })
    }

    const isInvalid = signInInfo.password === "" || signInInfo.email === "";

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline/>
            <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form onSubmit={handleSubmit} className={classes.form} noValidate>
                        <TextField
                            onChange={handleOnChange}
                            value={signInInfo.email}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoFocus
                        />
                        <TextField
                            onChange={handleOnChange}
                            value={signInInfo.password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            disabled={isInvalid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Button onClick={handleGoogleSignIn} color="secondary">
                            Google
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href={ROUTES.PASSWORD_FORGET} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href={ROUTES.SIGN_UP} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};


export default withFirebase(SignInPage);
