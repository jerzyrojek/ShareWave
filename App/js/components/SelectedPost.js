import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Rating from "./Rating";
import AuthUserContext from "./SessionContext";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import * as ROUTES from "../constants/routes";
import Sidebar from "./Sidebar";
import ClearIcon from "@material-ui/icons/Clear";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles(() => ({
    root: {
        width: "600px",
        margin: "1rem auto",
        padding:"0.5rem",
        boxShadow:"0px 0px 10px 2px rgba(0,0,0,0.3)",

    },
    media: {
        maxWidth: "100%",
        height: "auto",
    },
    image:{
        width: "100%",
        objectFit: "contain",
        cursor: "pointer"
    },
    video:{
        outline:"none",
        width: "100%",
    },
    avatar: {
        backgroundColor: "#2196f3",
    },
    close: {
        color:red[700],
    }
}));

const SelectedPost = (props) => {
    const classes = useStyles();
    const {postId} = useParams();
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [commentInput, setCommentInput] = useState({});
    const [comments, setComments] = useState(false);
    const history = useHistory();

    useEffect(() => {
        let mounted = true;
        if (postId) {
            props.firebase.database.collection("posts").doc(postId)
                .onSnapshot((snapshot => {
                    if(mounted){
                        setSelectedPostDetails(snapshot);
                    }

                }))
        }
        props.firebase.database.collection("posts").doc(postId).collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot => {
                if(mounted){
                    setComments(prev => snapshot.docs.map(doc => doc.data()))
                }
            }));

        return () => {
            mounted = false;
        }

    }, []);


    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setCommentInput((prev) => {
            return {...prev, [name]: value}
        });
    }

    const handleDeletePost = () => {
        const confirmation = confirm("Are you sure you want to delete this post?");
        if(confirmation === true) {
            props.firebase.database.collection("posts").doc(selectedPostDetails.id).delete().then(() => {
                console.log("deleted!")
            }).catch(err => {
                console.log(err);
            })
            history.push(ROUTES.HOME)
        }
    }

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        props.firebase.database.collection("posts").doc(postId).collection("comments")
            .add({
                ...commentInput,
                author: props.firebase.auth.currentUser.displayName,
                timestamp: new Date(),
            });
        setCommentInput(prevState => {
            return {...prevState, comment: ""}
        })
    }

    return (
        <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
            <div className="container">
                {selectedPostDetails &&
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="post" className={classes.avatar}>
                                {selectedPostDetails.data().author.charAt(0)}
                            </Avatar>
                        }
                        action={
                            <AuthUserContext.Consumer>
                                {authUser =>
                                    (authUser && authUser.role === "admin") ?
                                        <IconButton onClick={handleDeletePost} className={classes.close}
                                                    aria-label="settings">
                                            <ClearIcon/>
                                        </IconButton>
                                        :
                                        (authUser && authUser.uid === selectedPostDetails.data().userId) &&
                                        <IconButton onClick={handleDeletePost} className={classes.close}
                                                    aria-label="settings">
                                            <ClearIcon/>
                                        </IconButton>

                                }
                            </AuthUserContext.Consumer>
                        }
                        title={
                            <>
                            <Typography variant="h5">
                                {selectedPostDetails.data().title}
                            </Typography>
                                <Typography>{selectedPostDetails.data().category}</Typography>
                            </>
                        }
                        subheader={selectedPostDetails.data().timestamp.toDate().toLocaleString("pl-PL")}
                    />
                    {selectedPostDetails.data().media && selectedPostDetails.data().mediaType.includes("image") &&
                    <img className={classes.image}
                        alt="image"
                        src={selectedPostDetails.data().media}/>
                    }
                    {selectedPostDetails.data().media && selectedPostDetails.data().mediaType.includes("video") &&
                    <video className={classes.video} controls autoPlay loop muted>
                        <source src={selectedPostDetails.data().media} type={selectedPostDetails.data().mediaType}/>
                    </video>
                    }
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {selectedPostDetails.data().text}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? <Rating post={selectedPostDetails}/>
                                :
                                <>
                                    <Typography>{selectedPostDetails.data().rating}</Typography>
                                    <IconButton href={ROUTES.SIGN_IN} aria-label="thumbsUp">
                                        <ThumbUpIcon/>
                                    </IconButton>
                                    <IconButton href={ROUTES.SIGN_IN} aria-label="thumbsDown">
                                        <ThumbDownIcon/>
                                    </IconButton>
                                </>
                            }
                        </AuthUserContext.Consumer>

                    </CardActions>
                </Card>}

                <form onSubmit={handleCommentSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleOnChange}
                                name="comment"
                                value={setCommentInput.comment}
                                variant="outlined"
                                required
                                fullWidth
                                id="comment"
                                helperText="Maximum 500 characters"
                                label="Type your comment"
                                multiline={true}
                                rowsMax="7"
                                inputProps={{maxLength: 500}}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit"
                            variant="contained"
                            color="secondary">
                        Post comment
                    </Button>
                </form>
                <div className="post__comments">
                    <List>
                        {comments && comments.map((el, index) => {
                            return <ListItem className="comment__details" key={index}>
                                <ListItemText primary={el.author}
                                              secondary={el.timestamp.toDate().toLocaleString("pl-PL")}/>
                                <p>{el.comment}</p>
                                <hr/>
                            </ListItem>
                        })}
                    </List>
                </div>
            </div>
        </div>
    );
};

export default withFirebase(SelectedPost);
