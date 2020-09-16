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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {useHistory} from "react-router-dom";
import Rating from "./Rating";
import AuthUserContext from "./SessionContext";
import * as ROUTES from "../constants/routes";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";


const useStyles = makeStyles(() => ({
    root: {
        width: "600px",
    },
    media: {
        height: "auto",
        paddingTop: '60%',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const CardUserPost = ({id, author, timestamp, title, text, currentRating, media, tags}) => {
    const classes = useStyles();
    const date = new Date(timestamp?.toDate());
    const history = useHistory();


    const handleSelectPost = () => {
        if (id) {
            history.push(`post/${id}`);
        }
    }


    return (
        <>
            {id && <Card className={classes.root}>
                <CardHeader onClick={handleSelectPost}
                            avatar={
                                <Avatar aria-label="post" className={classes.avatar}>
                                    {author.charAt(0)}
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon/>
                                </IconButton>
                            }
                            title={title}
                            subheader={date.toLocaleString("pl-PL")}
                />
                {media &&
                <img onClick={handleSelectPost}
                     style={{cursor: "pointer", madWidth: "100%", width: "100%", height: "auto", objectFit: "contain"}}
                     alt="image"
                     src={media}/>
                }
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <AuthUserContext.Consumer>
                        {authUser => authUser ?
                            <>
                                <Rating postId={id}/>
                                <IconButton aria-label="comments">
                                    <CommentIcon/>
                                </IconButton>
                            </>
                            :
                            <>
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

export default CardUserPost;
