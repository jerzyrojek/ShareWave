import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import {withFirebase} from "./Firebase/context";


const Rating = ({postId, ...props}) => {
    const currentUserId = props.firebase.auth.currentUser.uid;
    const postRating = props.firebase.database.collection("posts").doc(postId).collection("rating");
    const [toggle, setToggle] = useState(false);
    const [currentCountState, setCurrentCountState] = useState(0);
    const [currentVote, setCurrentVote] = useState(0);

    useEffect(() => {
        let mounted = true;
        postRating.doc(`${postId}:${currentUserId}`).get().then((doc) => {
            if (doc.exists) {
                setCurrentVote(prevState => doc.data());
            }
        });


        postRating.onSnapshot((snapshot) => {
            let currentCount = 0;
            snapshot.forEach(doc => {
                currentCount += doc.data().state;
            });
            if (mounted) {
                return setCurrentCountState(currentCount);
            }
        });

        return () => {
            {
                setCurrentVote(0);
                mounted = false;
            }
        };

    }, [toggle]);


    const handleClickLiked = () => {
        setToggle(prev => !prev);
        postRating
            .doc(`${postId}:${currentUserId}`)
            .set({
                state: 1,
            });

        if (currentVote.state === 1) {
            postRating.doc(`${postId}:${currentUserId}`).delete().then(() => {
                setCurrentVote(0);
            })
        }
    }

    const handleClickDisliked = () => {
        setToggle(prev => !prev);
        postRating
            .doc(`${postId}:${currentUserId}`)
            .set({
                state: -1,
            });
        if (currentVote.state === -1) {
            postRating.doc(`${postId}:${currentUserId}`).delete().then(() => {
                setCurrentVote(0);
            })
        }
    }

    return (
        <>
            <Typography>{currentCountState}</Typography>
            <IconButton color={currentVote.state === 1 ? "secondary" : "default" } onClick={handleClickLiked} aria-label="thumbsUp">
                <ThumbUpIcon/>
            </IconButton>
            <IconButton color={currentVote.state === -1 ? "secondary" : "default" } onClick={handleClickDisliked} aria-label="thumbsDown">
                <ThumbDownIcon/>
            </IconButton>
        </>
    );
};

export default withFirebase(Rating);
