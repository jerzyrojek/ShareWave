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
import AlertComponent from "./Alert";

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

    const [status, setStatus] = useState({
        error:"",
        success:false,
    })

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
        if (url) {
            props.firebase.database.collection("posts").add({
                ...postDetails,
                media: url,
                mediaType: selectedFile.type,
                timestamp: new Date(),
            }).then(() => {
                setStatus(prev => ({
                    ...prev,
                    success: true,
                }))
                setTimeout(() => {
                    close();
                }, 2000)
            })
        }
    }, [url])


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
        setStatus(prev => ({error:"", success: false}));

        if (selectedFile && !selectedFile.type.includes("image") && (selectedFile && !selectedFile.type.includes("video"))){
            setStatus(({
                error:"Only images and videos can be uploaded",
                success: false,
            }))
            return;
        }
        if (selectedFile) {
            const uploadDate = Date.now().toString();
            const uploadFile = props.firebase.storage.ref(`media/${uploadDate}`).put(selectedFile);
            uploadFile.on("state_changed",
                snapshot => {
                },
                error => {
                   setStatus(prev => ({
                       ...prev,
                       error:error.message,
                       success: false,
                   }))
                },
                () => {
                    props.firebase.storage.ref("media").child(uploadDate).getDownloadURL().then(urlFromFirebase =>
                        setUrl(urlFromFirebase))
                }
            )

        } else if( !selectedFile && postDetails.text.length < 15){
            setStatus({
                success: false,
                error:"Post needs either media or text content(Minimum 15 characters)",
            })
            return;
        }else{
            props.firebase.database.collection("posts").add({
                ...postDetails,
                timestamp: new Date(),
            }).then(() => {
                setStatus(prev => ({
                    ...prev,
                    success: true,
                }))
                setTimeout(() => {
                    close();
                }, 2000)
            });
        }
    };

    return (
        <div className="app__upload">
            <form onSubmit={handleUploadSubmit} className={classes.form}>
                <Grid container spacing={2}>
                    <input accept="image/*, video/*" className={classes.input} onChange={handleFileSelect} type="file"/>
                    <Grid item xs={12}>
                        <TextField
                            onChange={handleOnChange}
                            name="title"
                            value={postDetails.title}
                            variant="outlined"
                            inputProps={{maxLength: 50}}
                            helperText="Maximum 50 characters"
                            required
                            fullWidth
                            id="postTitle"
                            label="Title"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            multiline={true}
                            rowsMax="7"
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
            {status.success && <AlertComponent type="success" message="Uploaded successfully!"/>}
            {status.error && <AlertComponent type="error" message={status.error}/>}
        </div>
    );
};

export default withFirebase(FileUpload);
