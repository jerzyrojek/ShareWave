import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {withFirebase} from "./Firebase/context";
import Sidebar from "./Sidebar";
import CardUserPost from "./CardUserPost";

const SelectedCategory = (props) => {
    const selectedCategoryName = useParams();
    const [categoryPosts, setCategoryPosts] = useState(null);

    useEffect(() => {
        let mounted = true;
        if (selectedCategoryName) {
            props.firebase.database.collection("posts")
                .where("category", "==", `${selectedCategoryName.categoryName}`)
                .orderBy("timestamp", "desc")
                .get()
                .then((querySnapshot) => {
                    if (mounted) {
                        setCategoryPosts(querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                author: doc.data().author,
                                timestamp: doc.data().timestamp,
                                title: doc.data().title,
                                text: doc.data().text,
                                media: doc.data().media,
                                mediaType: doc.data().mediaType,
                            }))
                        );
                    }
                });
        }
        return () => {
            {
                mounted = false;
            }
        }

    }, [selectedCategoryName, categoryPosts])


    return (
        <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
            <div className="userPosts container">
                {categoryPosts && categoryPosts.map((post, index) => {
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
                            />
                        )
                    }
                )
                }
            </div>
        </div>
    );
};

export default withFirebase(SelectedCategory);
