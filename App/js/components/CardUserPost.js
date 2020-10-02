import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import CommentIcon from '@material-ui/icons/Comment';
import {useHistory} from "react-router-dom";
import Rating from "./Rating";
import AuthUserContext from "./SessionContext";
import * as ROUTES from "../constants/routes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ClearIcon from '@material-ui/icons/Clear';
import {withFirebase} from "./Firebase/context";

const useStyles = makeStyles(() => ({
    root: {
        width: "600px",
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
        color: red[700],
    }
}));


const CardUserPost = ({post, ...props}) => {
    const classes = useStyles();
    const date = new Date(post.data().timestamp?.toDate());
    const history = useHistory();

    const handleSelectPost = () => {
        if (post.id) {
            history.push(`/post/${post.id}`);
        }
    }

    const handleDeletePost = () => {
        const confirmation = confirm("Are you sure you want to delete this post?");
        if(confirmation === true) {
            props.firebase.database.collection("posts").doc(post.id).delete().then(() => {
                console.log("deleted!")
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <>
            {post.id && <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="post" className={classes.avatar}>
                            {post.data().author.charAt(0)}
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
                                    (authUser && authUser.uid === post.data().userId) &&
                                    <IconButton onClick={handleDeletePost} className={classes.close}
                                                aria-label="settings">
                                        <ClearIcon/>
                                    </IconButton>

                            }
                        </AuthUserContext.Consumer>

                    }
                    title={
                        <>
                            <Typography variant="h5" onClick={handleSelectPost}>
                                {post.data().title}</Typography>
                            <Typography><span>{post.data().category}</span></Typography>
                        </>

                    }
                    subheader={date.toLocaleString("pl-PL")}
                />
                <div className={classes.media}>
                    {post.data().media && post.data().mediaType.includes("image") &&
                    <img className={classes.image} onClick={handleSelectPost}
                         alt="image"
                         src={post.data().media}/>
                    }
                    {post.data().media && post.data().mediaType.includes("video") &&
                    <video className={classes.video} controls loop muted>
                        <source src={post.data().media} type={post.data().mediaType}/>
                    </video>
                }
                </div>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {post.data().text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <AuthUserContext.Consumer>
                        {authUser => authUser ?
                            <>
                                <Rating post={post}/>
                                <IconButton aria-label="comments">
                                    <CommentIcon/>
                                </IconButton>
                            </>
                            :
                            <>
                                <Typography>{post.data().rating}</Typography>
                                <IconButton href={ROUTES.SIGN_IN} aria-label="thumbsUp">
                                    <ThumbUpIcon/>
                                </IconButton>
                                <IconButton href={ROUTES.SIGN_IN} aria-label="thumbsDown">
                                    <ThumbDownIcon/>
                                </IconButton>
                                <IconButton href={ROUTES.SIGN_IN} aria-label="comments">
                                    <CommentIcon/>
                                </IconButton>
                            </>
                        }
                    </AuthUserContext.Consumer>
                </CardActions>
            </Card>}
        </>
    );
}

export default withFirebase(CardUserPost);
