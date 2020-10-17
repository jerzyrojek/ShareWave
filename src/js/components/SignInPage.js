import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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
import AlertComponent from "./Alert";


const useStyles = makeStyles((theme) => ({
    root: {
        height: 'calc(100vh - 64px)',
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
    routes: {
        marginTop: "1rem"
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
        error: "",
        success: false
    }
    const [signInInfo, setSignInInfo] = useState({...initialState});

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = signInInfo;
        setSignInInfo(prev => ({...prev, error: "", success: false}))
        props.firebase.signInEmailAndPassword(email, password)
            .then(() => {
                setSignInInfo(prev => ({...prev, success: true}))
                setTimeout(() => {
                    setSignInInfo({...initialState});
                    history.push(ROUTES.HOME);
                }, 2000)
            }).catch(err => {
            setSignInInfo(prevState => (
                {
                    ...prevState,
                    error: err,
                }
            ))
        });
    }
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setSignInInfo((prev) => {
            return {...prev, [name]: value};
        });
    };

    const handleGoogleSignIn = () => {
        setSignInInfo(prev => ({...prev, error: "", success: false}))
        props.firebase.signInWithPopupUsingProvider(googleProvider).then((authUser) => {
            if (authUser.additionalUserInfo.isNewUser === true) {
                props.firebase.database.collection("users").doc(authUser.user.uid).set({
                    username: authUser.user.displayName,
                    email: authUser.user.email,
                    creationDate: new Date(),
                    role: "user",
                }).catch(err => {
                    setSignInInfo(prevState => (
                        {
                            ...prevState,
                            success: false,
                            error: err,
                        }
                    ))
                })
            }
        }).then(() => {
            setSignInInfo(prev => ({...prev, success: true}))
            setTimeout(() => {
                history.push(ROUTES.HOME);
            }, 2000)
        }).catch(err => {
            setSignInInfo(prevState => ({
                    ...prevState,
                    success: false,
                    error: err,
                }
            ))
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
                        <Button onClick={handleGoogleSignIn} color="secondary" fullWidth variant="contained">
                            Google
                        </Button>
                        <Grid className={classes.routes} container>
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
                {signInInfo.error && <AlertComponent type="error" message={signInInfo.error.message}/>}
                {signInInfo.success && <AlertComponent type="success" message="Signed in! Redirecting..."/>}
            </Grid>
        </Grid>
    );
};


export default withFirebase(SignInPage);
