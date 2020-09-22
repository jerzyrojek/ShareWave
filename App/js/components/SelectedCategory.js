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
                        setCategoryPosts(querySnapshot.docs);
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
                {categoryPosts && categoryPosts.map((doc, index) => {
                        return (
                            <CardUserPost
                                post={doc}
                                key={index}
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
