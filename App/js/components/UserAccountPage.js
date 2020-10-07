import React, {useContext, useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import AuthUserContext from "./SessionContext";
import Button from "@material-ui/core/Button";
import Sidebar from "./Sidebar";
import CardUserPost from "./CardUserPost";
import {withFirebase} from "./Firebase/context";
import PasswordChangeModal from "./PasswordChangeModal";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        margin: "1rem auto",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.3)",
        [theme.breakpoints.up("sm")]: {
            width: "600px"
        }
    },
    labels: {
        fontWeight:"bold",
    },
    controls: {
        display: "flex",
        justifyContent: "center",
        marginTop:"1rem",
    }
}));

const UserAccountPage = (props) => {
    const classes = useStyles();
    const [togglePosts, setTogglePosts] = useState(false);
    const [posts, setPosts] = useState(null);
    const currentUser = useContext(AuthUserContext);

    useEffect(() => {
        let mounted = true;

        if (togglePosts) {
            props.firebase.database.collection("posts")
                .where("userId", "==", `${currentUser.uid}`)
                .onSnapshot(snapshot => {
                    if (mounted) {
                        setPosts(snapshot.docs.sort((a,b) => {
                            return b.data().timestamp - a.data().timestamp;
                        }));
                    }
                })
        }

        return () => {
            mounted = false;
        }
    }, [togglePosts]);


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
                            <Card className={classes.root}>
                                <Typography color="secondary" variant="h3">Account Page</Typography>
                                <Typography className={classes.labels} color="secondary" variant="h5">Display name</Typography>
                                <Typography variant="h5">{authUser.username}</Typography>
                                <Typography className={classes.labels} color="secondary" variant="h5">Email</Typography>
                                <Typography variant="h5">{authUser.email}</Typography>
                                <Typography className={classes.labels} color="secondary" variant="h5">Creation date</Typography>
                                <Typography>{authUser.creationDate.toDate().toLocaleString("PL-pl")}</Typography>
                                <div className={classes.controls}>
                                    <PasswordChangeModal/>
                                    <Button color="secondary" variant="contained" onClick={showPosts}>Show my posts</Button>
                                </div>
                            </Card>
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

const condition = authUser => !!authUser;

export default PermissionsContext(condition)(withFirebase(UserAccountPage));
