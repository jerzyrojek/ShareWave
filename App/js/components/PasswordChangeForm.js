import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withFirebase} from "./Firebase/context";

const PasswordChangeForm = (props) => {

    const [passwords, setPasswords] = useState({
        currentPassword:"",
        newPasswordOne:"",
        newPasswordTwo:"",
        error:""
    })

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setPasswords((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handlePasswordChangeSubmit = (e) => {
        e.preventDefault();
        props.firebase.updateUserPassword(passwords.currentPassword, passwords.newPasswordOne);
        setPasswords({
            currentPassword:"",
            newPasswordOne:"",
            newPasswordTwo:"",
            error:""
        })
    }

    return (
        <>
            <form onSubmit={handlePasswordChangeSubmit}>
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
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary">Change</Button>
            </form>
        </>
    );
};

export default withFirebase(PasswordChangeForm);
