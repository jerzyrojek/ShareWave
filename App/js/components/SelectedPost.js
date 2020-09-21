import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {withFirebase} from "./Firebase/context";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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


const useStyles = makeStyles(() => ({
    root: {
        width: "600px",
        margin: "1rem auto"
    },
    media: {
        height: "auto",
        paddingTop: '60%',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const SelectedPost = (props) => {
    const classes = useStyles();
    const {postId} = useParams();
    const [selectedPostDetails, setSelectedPostDetails] = useState();
    const [commentInput, setCommentInput] = useState({});
    const [comments, setComments] = useState(false);

    useEffect(() => {
        if (postId) {
            props.firebase.database.collection("posts").doc(postId)
                .onSnapshot((snapshot => {
                    setSelectedPostDetails(snapshot.data());
                }))
        }
        props.firebase.database.collection("posts").doc(postId).collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot => {
                setComments(prev => snapshot.docs.map(doc => doc.data()))
            }));

    }, []);

    const handleOnChange = (e) => {
        const {name, value} = e.target;
        setCommentInput((prev) => {
            return {...prev, [name]: value}
        });
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
                                {selectedPostDetails.author.charAt(0)}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon/>
                            </IconButton>
                        }
                        title={
                            <Typography>
                                {selectedPostDetails.title} {selectedPostDetails.category}
                            </Typography>
                        }
                        subheader={selectedPostDetails.timestamp.toDate().toLocaleString("pl-PL")}
                    />
                    {selectedPostDetails.media && selectedPostDetails.mediaType.includes("image") &&
                    <img
                        style={{
                            madWidth: "100%",
                            width: "100%",
                            height: "auto",
                            objectFit: "contain"
                        }}
                        alt="image"
                        src={selectedPostDetails.media}/>
                    }
                    {selectedPostDetails.media && selectedPostDetails.mediaType.includes("video") &&
                    <video width="100%" controls>
                        <source src={selectedPostDetails.media} type={selectedPostDetails.mediaType}/>
                    </video>
                    }
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {selectedPostDetails.text}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <AuthUserContext.Consumer>
                            {authUser => authUser ? <Rating postId={postId}/>
                                :
                                <>
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
