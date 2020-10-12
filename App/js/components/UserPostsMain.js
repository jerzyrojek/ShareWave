import React, {useContext, useEffect, useState} from 'react';
import CardUserPost from "./CardUserPost";
import Sidebar from "./Sidebar";
import {withFirebase} from "./Firebase/context";
import {useHistory} from "react-router-dom";
import ScrollContext from "./ScrollContext";

const UserPostsMain = (props) => {
    const [posts, setPosts] = useState(null);
    const history = useHistory();
    const scrollY = useContext(ScrollContext);


    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("posts")
            .get()
            .then(querySnapshot => {
                if(mounted) {
                    setPosts(querySnapshot.docs)
                }
            })

        return () => {
            scrollY.setNewScroll(window.scrollY);
            mounted = false;
        }
    },[]);

    useEffect(() => {
        if(history.action === "POP" && scrollY.scrollPosition > 500){
            setTimeout(() => {
                window.scrollTo(0, scrollY.scrollPosition);
            },2000)
        }
    },[posts])

    return (
        <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
            <div className="userPosts container">
                {posts && posts.sort((a,b) => b.data().rating - a.data().rating).map((doc, index) => {
                    return (
                        <CardUserPost
                            post={doc}
                            key={index}
                        />
                    )
                })
                }
            </div>
        </div>
    );
};

export default withFirebase(UserPostsMain);
