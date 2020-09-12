import React from 'react';
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
        maxWidth: 600,
    },
    media: {
        height: "auto",
        paddingTop: '65.25%',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const CardUserPost = () => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        JR
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title="Test"
                subheader="September 10, 2020"
            />
            <CardMedia
                className={classes.media}
                image="../../assets/example.jpg"
                title="postImage"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem cum cumque facilis inventore iure
                    placeat sit veniam. Dignissimos, eligendi, enim ex facere fuga hic maxime molestiae necessitatibus
                    odio recusandae rem.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
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
