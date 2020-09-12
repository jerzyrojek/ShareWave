import React, {useEffect, useState} from 'react';
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "60%",
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

const FileUpload = (props) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState(null);
    const [url, setUrl] = useState(null);
    const [postDetails, setPostDetails] = useState({
        author: props.firebase.auth.currentUser.displayName,
        timestamp: "",
        title: "",
        media: "",
        text: "",
        rating: 0,
        tags: [],
    });

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setPostDetails((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handleFileSelect = (e) => {
        {
            e.target.files[0] && setSelectedFile(e.target.files[0])
        }
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        const uploadFile = props.firebase.storage.ref(`media/${selectedFile.name}`).put(selectedFile);
        uploadFile.on("state_changed",
            snapshot => {
            },
            error => {
                console.log(error);
            },
            () => {
                props.firebase.storage.ref("media").child(selectedFile.name).getDownloadURL().then(urlFromFirebase =>
                    setUrl(urlFromFirebase))
            }
        )
        console.log("Uploaded!")
    };

    useEffect(() => {
        {
            url && props.firebase.database.collection("posts").add({
                ...postDetails,
                media: url,
                timestamp: new Date(),
            });
        }

        return () => {
            
        }
    }, [url]);

    return (
        <div className="app__upload">
            <form onSubmit={handleUploadSubmit} className={classes.form}>
                <Grid container spacing={2}>
                    <input onChange={handleFileSelect} type="file"/>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            name="title"
                            value={postDetails.title}
                            variant="outlined"
                            required
                            fullWidth
                            id="postTitle"
                            label="Title"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            value={postDetails.text}
                            variant="outlined"
                            fullWidth
                            id="postText"
                            label="Text"
                            name="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            value={postDetails.tags}
                            variant="outlined"
                            required
                            fullWidth
                            name="tags"
                            label="Tags"
                            id="tags"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}>Upload</Button>
            </form>
        </div>
    );
};

export default withFirebase(FileUpload);
