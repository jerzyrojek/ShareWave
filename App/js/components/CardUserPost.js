import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import CommentIcon from '@material-ui/icons/Comment';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const useStyles = makeStyles(() => ({
    root: {
        width:"600px",
    },
    media: {
        height: "auto",
        paddingTop: '65.25%',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const CardUserPost = ({author, timestamp, title, text, currentRating}) => {
    const classes = useStyles();
    const [rating, setRating] = useState(currentRating);
    const date = new Date(timestamp?.toDate());

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="post" className={classes.avatar}>
                        {author}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={title}
                subheader={date.toLocaleDateString()}
            />
            <CardMedia
                className={classes.media}
                image="../../assets/example.jpg"
                title="postImage"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {text}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Typography>{rating}</Typography>
                <IconButton aria-label="thumbsUp">
                    <ThumbUpIcon/>
                </IconButton>
                <IconButton aria-label="thumbsDown">
                    <ThumbDownIcon/>
                </IconButton>
                <IconButton aria-label="comments">
                    <CommentIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default CardUserPost;
