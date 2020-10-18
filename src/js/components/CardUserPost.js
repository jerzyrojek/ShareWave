import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import CommentIcon from '@material-ui/icons/Comment';
import {Link, useHistory} from "react-router-dom";
import Rating from "./Rating";
import AuthUserContext from "./SessionContext";
import * as ROUTES from "../constants/routes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ClearIcon from '@material-ui/icons/Clear';
import {withFirebase} from "./Firebase/context";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        padding: "0.5rem",
        boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.3)",
        [theme.breakpoints.up("sm")]: {
            width: "600px"
        }
    },
    media: {
        maxWidth: "100%",
        height: "auto",
    },
    image: {
        width: "100%",
        objectFit: "contain",
        cursor: "pointer"
    },
    video: {
        outline: "none",
        width: "100%",
    },
    title: {
        cursor: "pointer",
        fontWeight: "700",
    },
    clickable: {
        cursor: "pointer",
    },
    categoryWrap: {
        margin: "0.3rem 0",
    },
    category: {
        padding: "5px",
        backgroundColor: "#263238",
        color: "white",
        cursor: "pointer",
    },
    close: {
        color: red[700],
    },
    text: {
        color: "#000000",
        textAlign: "justify",
        fontSize: "1rem",
    },
    rating: {
        paddingLeft: "16px",
    },
    action: {
        [theme.breakpoints.down("xs")]: {
            alignSelf: "center"
        }
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

    const handleSelectPostComments = () => {
        history.push({
            pathname: `/post/${post.id}`,
            state: {
                from: "commentIcon"
            }
        });
    }

    const handleSelectCategory = (category) => {
        if (category) {
            history.push(`/category/${category}`);

        }
    }

    const handleDeletePost = () => {
        const confirmation = confirm("Are you sure you want to delete this post?");
        if (confirmation === true) {
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
                    action={
                        <AuthUserContext.Consumer>
                            {authUser =>
                                (authUser && authUser.role === "admin") ?
                                    <IconButton onClick={handleDeletePost} className={classes.close}
                                                aria-label="settings">
                                        <ClearIcon/>
                                    </IconButton>
                                    :
                                    (history.pathname !== "/" && authUser && authUser.uid === post.data().userId) &&
                                    <IconButton onClick={handleDeletePost} className={classes.close}
                                                aria-label="settings">
                                        <ClearIcon/>
                                    </IconButton>
                            }
                        </AuthUserContext.Consumer>
                    }
                    classes={{action: classes.action}}
                    title={
                        <>
                            <Typography className={classes.title} variant="h5" onClick={handleSelectPost}>
                                {post.data().title}</Typography>
                            <Typography className={classes.categoryWrap}><span
                                onClick={() => handleSelectCategory(post.data().category)}
                                className={classes.category}>{post.data().category}</span></Typography>
                        </>
                    }
                    subheader={
                        <>
                            <p className={classes.clickable}
                               onClick={handleSelectPost}>{date.toLocaleString("pl-PL")}</p>
                            <p className={classes.clickable} onClick={handleSelectPost}>Posted
                                by {post.data().author}</p>
                        </>
                    }
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
                    <Typography className={classes.text} variant="body2" component="p">
                        {post.data().text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing classes={{
                    root: classes.rating,
                }}>
                    <AuthUserContext.Consumer>
                        {authUser => authUser ?
                            <>
                                <Rating post={post}/>
                                <IconButton onClick={handleSelectPostComments} aria-label="comments">
                                    <CommentIcon/>
                                </IconButton>
                            </>
                            :
                            <>
                                <Typography>{post.data().rating}</Typography>
                                <IconButton
                                    component={Link}
                                    to={ROUTES.SIGN_IN}
                                    aria-label="thumbsUp">
                                    <ThumbUpIcon/>
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    to={ROUTES.SIGN_IN}
                                    aria-label="thumbsDown">
                                    <ThumbDownIcon/>
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    to={ROUTES.SIGN_IN}
                                    aria-label="comments">
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
