import React, {useState} from 'react';
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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

const CategorySuggestionForm = ({close, ...props}) => {
    const classes = useStyles();
    const [categoryInfo, setCategoryInfo] = useState({
        categoryName: "",
        description: "",
        error: "",
        success: false,
    })


    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setCategoryInfo((prev) => {
            return {...prev, [name]: value}
        });
    }
    const handleCategorySubmit = (e) => {
        e.preventDefault();
        setCategoryInfo(prev => ({
            ...prev,
            error: "",
            success: false
        }));

        props.firebase.database.collection("suggested").add({
            name: categoryInfo.categoryName,
            description: categoryInfo.description,
            timestamp: new Date(),
        }).then(() => {
            setCategoryInfo(prev => ({...prev, success: true}))
            setTimeout(() => {
                close();
            }, 2000)
        }).catch((err) => {
            setCategoryInfo(prev => ({
                ...prev,
                error: err,
            }))
        })
    }

    return (
        <form className={classes.form} onSubmit={handleCategorySubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        type="text"
                        name="categoryName"
                        variant="outlined"
                        value={categoryInfo.categoryName}
                        required
                        fullWidth
                        id="categoryName"
                        label="Category name"
                        inputProps={{maxLength: 30}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        onChange={handleOnChange}
                        variant="outlined"
                        value={categoryInfo.description}
                        fullWidth
                        id="description"
                        label="Description (Optional)"
                        name="description"
                        multiline={true}
                        rowsMax="7"
                        inputProps={{maxLength: 500}}
                    />
                </Grid>
            </Grid>
            <Button
                className={classes.submit}
                type="submit"
                fullWidth
                variant="contained"
                color="primary">Submit suggestion</Button>
            {categoryInfo.success && <AlertComponent type="success" message="Suggestion successfully submitted!"/>}
            {categoryInfo.error && <AlertComponent type="error" message={categoryInfo.error.message}/>}
        </form>
    );
};

export default withFirebase(CategorySuggestionForm);
