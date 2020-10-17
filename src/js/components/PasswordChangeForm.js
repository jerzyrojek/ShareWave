import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import app from "firebase/app";
import AlertComponent from "./Alert";


const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const PasswordChangeForm = ({close, ...props}) => {
    const classes = useStyles();

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPasswordOne: "",
        newPasswordTwo: "",
        error: "",
        success: false
    });


    const reauthenticate = (currentPassword) => {
        const currentUser = props.firebase.auth.currentUser;
        const cred = app.auth.EmailAuthProvider.credential(
            currentUser.email, currentPassword);
        return currentUser.reauthenticateWithCredential(cred);
    }


    const updateUserPassword = (currentPassword, newPassword) => {
        reauthenticate(currentPassword).then(() => {
            props.firebase.auth.currentUser.updatePassword(newPassword).then(() => {
                setPasswords({
                    currentPassword: "",
                    newPasswordOne: "",
                    newPasswordTwo: "",
                    error: "",
                    success: true
                })
            }).then(() => {
                setTimeout(() => {
                    close();
                }, 2000)
            })
        }).catch(err => {
            setPasswords({
                currentPassword: "",
                newPasswordOne: "",
                newPasswordTwo: "",
                error: err,
                success: false
            })
        })
    };

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setPasswords((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handlePasswordChangeSubmit = (e) => {
        e.preventDefault();
        setPasswords(prev => ({
            ...prev,
            error: "",
            success: false
        }));
        updateUserPassword(passwords.currentPassword, passwords.newPasswordOne);
    }

    return (
        <>
            <form className={classes.form} onSubmit={handlePasswordChangeSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            type="password"
                            name="currentPassword"
                            variant="outlined"
                            value={passwords.currentPassword}
                            required
                            fullWidth
                            id="currentPassword"
                            label="Current Password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            type="password"
                            variant="outlined"
                            value={passwords.newPasswordOne}
                            fullWidth
                            required
                            id="newPasswordOne"
                            label="New password"
                            name="newPasswordOne"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            variant="outlined"
                            type="password"
                            value={passwords.newPasswordTwo}
                            fullWidth
                            required
                            id="newPasswordTwo"
                            label="Repeat new password"
                            name="newPasswordTwo"
                        />
                    </Grid>
                </Grid>
                <Button
                    className={classes.submit}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary">Change</Button>
                {passwords.success && <AlertComponent type="success" message={"Password changed!"}/>}
                {passwords.error && <AlertComponent type="error" message={passwords.error.message}/>}
            </form>
        </>
    );
};

export default withFirebase(PasswordChangeForm);
