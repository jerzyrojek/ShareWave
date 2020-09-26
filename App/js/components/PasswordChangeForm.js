import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withFirebase} from "./Firebase/context";

const PasswordChangeForm = () => {

    const [passwords, setPasswords] = useState({
        passwordOne:"",
        newPasswordOne:"",
        newPasswordTwo:"",
    })

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setPasswords((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handlePasswordChangeSubmit = (e) => {
        e.preventDefault();
        console.log("Sent!");

        //props.firebase.updateUserPassword
    }

    return (
        <>
            <form onSubmit={handlePasswordChangeSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="currentPassword"
                            variant="outlined"
                            required
                            fullWidth
                            id="currentPassword"
                            label="Current Password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            required
                            id="newPasswordOne"
                            label="New password"
                            name="newPasswordOne"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
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
