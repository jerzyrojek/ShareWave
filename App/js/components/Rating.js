import React, {useContext, useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import {withFirebase} from "./Firebase/context";
import AuthUserContext from "./SessionContext";


const Rating = ({post, ...props}) => {
    const authUser = useContext(AuthUserContext);
    let currentUserId = authUser.uid
    const postRating = props.firebase.database.collection("posts").doc(post.id).collection("rating");
    const [toggle, setToggle] = useState(false);
    const [currentVote, setCurrentVote] = useState(0);
    const [currentRating, setCurrentRating] = useState(null);


    useEffect(() => {
        let mounted = true;
        postRating.onSnapshot((snapshot) => {
            let currentCount = 0;
            snapshot.forEach(doc => {
                    currentCount += doc.data().state;
                if(mounted) {
                    setCurrentRating(currentCount);
                }
            })
        })



        postRating.doc(`${post.id}:${currentUserId}`)
            .onSnapshot(snapshot => {
                if (snapshot.exists) {
                    setCurrentVote(snapshot.data().state);
                }
            })
            return () => {
            mounted = false;
            }
    }, [])


    useEffect(() => {
        let mounted = true;
        postRating.onSnapshot((snapshot) => {
            let currentCount = 0;
            snapshot.forEach(doc => {
                currentCount += doc.data().state;
            });

            if (mounted) {
                props.firebase.database.collection("posts").doc(post.id).update({
                    rating: currentCount
                }).then(() => {
                    setCurrentRating(currentCount);
                })

            }
        });

        return () => {
            {
                mounted = false;
            }
        };

    }, [toggle]);


    const handleClickLiked = () => {
        setToggle(prev => !prev);
        if (currentVote === 1) {
            postRating.doc(`${post.id}:${currentUserId}`).delete().then(() => {
                setCurrentVote(0);
            })
        } else {
            postRating
                .doc(`${post.id}:${currentUserId}`)
                .set({
                    state: 1,
                }).then(() => {
                setCurrentVote(1);
            });
        }
    }

    const handleClickDisliked = () => {
        setToggle(prev => !prev);
        if (currentVote === -1) {
            postRating.doc(`${post.id}:${currentUserId}`).delete().then(() => {
                setCurrentVote(0);
            })
        }else {
            postRating
                .doc(`${post.id}:${currentUserId}`)
                .set({
                    state: -1,
                }).then(() => {
                    setCurrentVote(-1);
            });
        }

    }

    return (
        <>
            <Typography>{currentRating}</Typography>
            <IconButton color={currentVote === 1 ? "secondary" : "default"} onClick={handleClickLiked}
                        aria-label="thumbsUp">
                <ThumbUpIcon/>
            </IconButton>
            <IconButton color={currentVote === -1 ? "secondary" : "default"} onClick={handleClickDisliked}
                        aria-label="thumbsDown">
                <ThumbDownIcon/>
            </IconButton>
        </>
    );
};

export default withFirebase(Rating);
