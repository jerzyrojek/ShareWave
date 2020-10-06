import React, {useContext, useEffect, useState} from 'react';
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import {FormControl} from "@material-ui/core";
import AuthUserContext from "./SessionContext";

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    select: {
        minWidth: 120,
        margin: "0.5rem 0",
    },
    input: {
        padding: "8px"
    }
}));

const FileUpload = ({close, ...props}) => {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectOptions, setSelectOptions] = useState(null);
    const [fileMetadata, setFileMetadata] = useState(false);
    const [url, setUrl] = useState(null);
    const currentUser = useContext(AuthUserContext);

    const [postDetails, setPostDetails] = useState({
        author: currentUser.username,
        userId: currentUser.uid,
        timestamp: "",
        rating: 0,
        title: "",
        text: "",
        category: "",
    });

    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("categories")
            .onSnapshot(snapshot => {
                if (mounted) {
                    setSelectOptions(snapshot.docs.map(doc => ({
                        name: doc.data().name,
                    })))
                }
            })

        return () => {
            mounted = false;
        }
    }, [])


    useEffect(() => {
        let mounted = true;
        if (url) {
            props.firebase.storage.ref(`media/${selectedFile.name}`).getMetadata().then(metadata => {
                if (mounted) {
                    setFileMetadata(metadata);
                }
            });
        }
        return () => {
            mounted = false;
        }
    }, [url]);

    useEffect(() => {
        if (url && fileMetadata) {
            props.firebase.database.collection("posts").add({
                ...postDetails,
                media: url,
                mediaType: fileMetadata.contentType,
                timestamp: new Date(),
            }).then(() => {
                return close();
            })
        }
    }, [fileMetadata])


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
        if (selectedFile) {
            const uploadFile = props.firebase.storage.ref(`media/${Date.now()}`).put(selectedFile);
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

        } else {
            props.firebase.database.collection("posts").add({
                ...postDetails,
                timestamp: new Date(),
            });
        }
    };

    return (
        <div className="app__upload">
            <form onSubmit={handleUploadSubmit} className={classes.form}>
                <Grid container spacing={2}>
                    <input className={classes.input} onChange={handleFileSelect} type="file"/>
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
                        <FormControl fullWidth variant="outlined" className={classes.select}>
                            <InputLabel id="categorySelect">Category</InputLabel>
                            <Select
                                required
                                labelId="category"
                                name="category"
                                id="category"
                                defaultValue={""}
                                onChange={handleOnChange}
                                label="Category"
                            >
                                <MenuItem disabled value={""}>
                                    <em>Please choose a category</em>
                                </MenuItem>
                                {selectOptions && selectOptions.map((option, index) => {
                                    return (
                                        <MenuItem key={index} value={option.name}>
                                            <em>{option.name}</em>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>

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
