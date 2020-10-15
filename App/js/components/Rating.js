import React, {useContext, useEffect, useRef, useState} from 'react';
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
    const [likedToggle, setLikedToggle] = useState(false);
    const [dislikedToggle, setDislikedToggle] = useState(false);
    const [currentVote, setCurrentVote] = useState(0);
    const [currentRating, setCurrentRating] = useState(0);
    const isMountedRefLike = useRef(false);
    const isMountedRefDislike = useRef(false);


    useEffect(() => {
        console.log("fire every time");
        let mounted = true;
        postRating.onSnapshot(snapshot => {
            let currentCount = 0;
            snapshot.docChanges().forEach(change => {
                currentCount += change.doc.data().state;
                if(mounted){
                    setCurrentRating(currentCount);
                }
            })

            const vote = snapshot.docs.filter((doc) => {
                return doc.id === `${post.id}:${currentUserId}`
            })

            if(vote.length === 1 && mounted) {
                setCurrentVote(vote[0].data().state);
            }
        })

        return () => {
            mounted = false;
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        if(isMountedRefLike.current) {
            console.log("liked!")
            if (currentVote === 1) {
                postRating.doc(`${post.id}:${currentUserId}`).delete().then(() => {
                    if(mounted) {
                        setCurrentVote(0);
                    }
                })
            } else{
                postRating
                    .doc(`${post.id}:${currentUserId}`)
                    .set({
                        state: 1,
                    }).then(() => {
                        if(mounted) {
                            setCurrentVote(1);
                        }
                });
            }

            postRating.onSnapshot((snapshot) => {
                let currentCount = 0;
                snapshot.forEach(doc => {
                    currentCount += doc.data().state;
                });

                props.firebase.database.collection("posts").doc(post.id).update({
                    rating: currentCount
                }).then(() => {
                    if(mounted){
                        setCurrentRating(currentCount);
                    }
                })

            });

        } else {
            isMountedRefLike.current = true;
        }

        return () => {
            mounted = false;
        }
    },[likedToggle]);


    useEffect(() => {
        let mounted = true;
        if(isMountedRefDislike.current) {
            console.log("disliked!");
            console.log(isMountedRefDislike);
            if (currentVote === -1) {
                postRating.doc(`${post.id}:${currentUserId}`).delete().then(() => {
                    if(mounted) {
                        setCurrentVote(0);
                    }
                })
            }else{
                postRating
                    .doc(`${post.id}:${currentUserId}`)
                    .set({
                        state: -1,
                    }).then(() => {
                        if(mounted) {
                            setCurrentVote(-1);
                        }
                });
            }

            postRating.onSnapshot((snapshot) => {
                let currentCount = 0;
                snapshot.forEach(doc => {
                    currentCount += doc.data().state;
                });

                props.firebase.database.collection("posts").doc(post.id).update({
                    rating: currentCount
                }).then(() => {
                    if(mounted){
                        setCurrentRating(currentCount);
                    }
                })

            });

        } else {
            isMountedRefDislike.current = true;
        }

        return () => {
            mounted = false;
        }
    },[dislikedToggle]);


    const handleClickLiked = () => {
        setLikedToggle(prev => !prev);
    }
    
    const handleClickDisliked = () => {
        setDislikedToggle(prev => !prev);
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
