import React, {useEffect, useState} from 'react';
import CardUserPost from "./CardUserPost";
import Sidebar from "./Sidebar";
import {withFirebase} from "./Firebase/context";

const UserPostsMain = (props) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("posts")
            .orderBy("rating", "desc")
            .onSnapshot(snapshot => {
                    if (mounted) {
                        setPosts(snapshot.docs)

                    }
                }
            )

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
            <div className="userPosts container">
                {posts && posts.map((doc, index) => {
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
