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
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";


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

    console.log(selectedPostDetails);

    useEffect(() => {
        if (postId) {
            props.firebase.database.collection("posts").doc(postId)
                .onSnapshot((snapshot => {
                    setSelectedPostDetails(snapshot.data());
                }))
        }
    }, []);

    return (
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
                            title={selectedPostDetails.title}
                            subheader={selectedPostDetails.timestamp.toDate().toLocaleDateString()}
                />
                <img style={{ madWidth: "100%", width: "100%", height: "auto", objectFit: "contain"}} alt="image"
                     src={selectedPostDetails.media}/>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {selectedPostDetails.text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Typography>{selectedPostDetails.rating}</Typography>
                    <IconButton aria-label="thumbsUp">
                        <ThumbUpIcon/>
                    </IconButton>
                    <IconButton aria-label="thumbsDown">
                        <ThumbDownIcon/>
                    </IconButton>
                </CardActions>
            </Card>}


        </div>
    );
};

export default withFirebase(SelectedPost);
