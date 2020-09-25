import React, {useState} from 'react';
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {withFirebase} from "./Firebase/context";
import AlertComponent from "./Alert";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    title:{
      margin:"1rem 0"
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const PasswordResetPage = (props) => {
    const classes = useStyles();
    const [pwResetForm, setPwResetForm] = useState({
        email:"",
        error:""
    });


    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setPwResetForm((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setPwResetForm(prev => ({...prev, error:""}));
        props.firebase.passwordReset(pwResetForm.email).then((res) => {
            console.log(res);
        }).catch((err) => {
            setPwResetForm(prev => ({
                ...prev,
                error:err
            }))
        })
    }

    return (
        <div className="password__reset">
            <form onSubmit={handleSubmit} className={classes.form}>
                <Typography className={classes.title} variant="h3">Reset your password</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            name="email"
                            type="email"
                            value={pwResetForm.email}
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>Reset</Button>
                {pwResetForm.error && <AlertComponent type="error" message={pwResetForm.error.message}/>}
            </form>
        </div>
    );
};

export default withFirebase(PasswordResetPage);
