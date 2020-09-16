import React, {useEffect, useState} from 'react';
import CardUserPost from "./CardUserPost";
import Sidebar from "./Sidebar";
import {withFirebase} from "./Firebase/context";

const UserPostsMain = (props) => {

    const [posts, setPosts] = useState(null);


    useEffect(() => {
        props.firebase.database.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => (
            setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    author: doc.data().author,
                    timestamp: doc.data().timestamp,
                    title: doc.data().title,
                    text: doc.data().text,
                    rating: doc.data().rating,
                    media: doc.data().media,
                    mediaType: doc.data().mediaType,
                    tags: doc.data().tags
                }))
            )));
    }, []);

    return (
        <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
            <div className="userPosts container">
                {posts && posts.map((post, index) => {
                        return (
                            <CardUserPost
                                id={post.id}
                                key={index}
                                title={post.title}
                                timestamp={post.timestamp}
                                author={post.author}
                                text={post.text}
                                media={post.media}
                                mediaType={post.mediaType}
                                tags={post.tags}
                            />
                        )
                    }
                )
                }
            </div>
        </div>
    );
};

export default withFirebase(UserPostsMain);
