import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as ROUTES from "../constants/routes";
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import AlertComponent from "./Alert";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const SignUpPage = () => {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <SignUpForm/>

            </div>
        </Container>
    );
};

const SignUpFormBase = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const initialState = {
        username: '',
        email: '',
        passwordOne: '',
        passwordTwo: '',
        success: false,
        error: null,
    }
    const [formInput, setFormInput] = useState({...initialState});

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setFormInput(prev => (
            {...prev, error: ""}));
        const {username, email, passwordOne} = formInput;
        props.firebase.database.collection("users")
            .where("username", "==", `${username}`)
            .get()
            .then((snapshot) => {
                if (snapshot.docs.length === 0) {
                    props.firebase.newUserEmailAndPassword(email, passwordOne)
                        .then(authUser => {
                            props.firebase.database.collection("users").doc(authUser.user.uid).set({
                                username: username,
                                email: email,
                                creationDate: new Date(),
                                role: "user"
                            }).then(() => {
                                props.firebase.auth.currentUser.updateProfile({displayName: username}).then(() => {
                                    setFormInput({...initialState, success: true});
                                    setTimeout(() => {
                                        history.push(ROUTES.HOME);
                                    }, 2000)

                                })
                            })
                        }).catch(err => {
                        setFormInput(prev => (
                            {...prev, error: err}
                        ))
                    });
                } else {
                    setFormInput(prev => ({
                        ...prev, error: {
                            message: "Username taken! Please choose a different one"
                        }
                    }))
                }
            })


    }
    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setFormInput((prev) => {
            return {...prev, [name]: value}
        });
    }

    const isInvalid =
        formInput.passwordOne !== formInput.passwordTwo ||
        formInput.passwordOne === "" ||
        formInput.email === "" ||
        formInput.username === "";

    return (
        <form onSubmit={handleOnSubmit} className={classes.form} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        name="username"
                        value={formInput.username}
                        variant="outlined"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        value={formInput.email}
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        value={formInput.passwordOne}
                        variant="outlined"
                        required
                        fullWidth
                        name="passwordOne"
                        label="Password"
                        type="password"
                        id="passwordOne"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        value={formInput.passwordTwo}
                        variant="outlined"
                        required
                        fullWidth
                        name="passwordTwo"
                        label="Repeat password"
                        type="password"
                        id="passwordTwo"
                    />
                </Grid>
            </Grid>
            <Button
                disabled={isInvalid}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Sign Up
            </Button>
            <Grid container justify="flex-end">
                <Grid item>
                    <Link to={ROUTES.SIGN_IN} variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Grid>
            </Grid>
            {formInput.error && <AlertComponent type="error" message={formInput.error.message}/>}
            {formInput.success && <AlertComponent type="success" message="Successfully registered! Redirecting!"/>}
        </form>
    )
}

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage;
export {SignUpForm};