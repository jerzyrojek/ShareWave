import React, {useContext, useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import AuthUserContext from "./SessionContext";
import Button from "@material-ui/core/Button";
import Sidebar from "./Sidebar";
import CardUserPost from "./CardUserPost";

const UserAccountPage = (props) => {
    const [togglePosts, setTogglePosts] = useState(false);
    const [posts, setPosts] = useState(null);
    const currentUser = useContext(AuthUserContext);


    useEffect(() => {
        let mounted = true;
        if (togglePosts) {
            props.firebase.database.collection("posts")
                .where("userId", "==", `${currentUser.uid}`)
                .orderBy("timestamp", "desc")
                .get()
                .then((querySnapshot) => {
                    if (mounted) {
                        setPosts(querySnapshot.docs);
                    }
                });
        }

        return () => {
            mounted = false;
        }
    }, );

    const showPosts = () => {
        setTogglePosts(prev => !prev);
    }

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <>
                    <div className="app_sidebar">
                        <Sidebar/>
                    </div>
                    <div className="user container">
                        <div className="user__details">
                            <Typography variant="h3">User Page</Typography>
                            <Typography variant="h5">Display name: {authUser.username}</Typography>
                            <Typography variant="h5">Email: {authUser.email}</Typography>
                            <Button color="secondary" variant="contained">Change Password</Button>
                            <Button color="secondary" variant="contained" onClick={showPosts}>Show my posts</Button>
                        </div>
                        <div className="user__posts">
                            {posts && togglePosts && posts.map((post, index) => {
                                return <CardUserPost key={index} post={post}/>
                            })}
                        </div>
                    </div>
                </>
            )}
        </AuthUserContext.Consumer>
    );
};

const condition = authUSer => !!authUSer;

export default PermissionsContext(condition)(UserAccountPage);
