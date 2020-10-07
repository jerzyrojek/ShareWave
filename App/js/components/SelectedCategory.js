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
                .onSnapshot(snapshot => {
                    if (mounted) {
                        setCategoryPosts(snapshot.docs.sort((a, b) => {
                                return b.data().timestamp - a.data().timestamp;
                            }
                        ))
                    }
                })
        }
        return () => {
            {
                mounted = false;
            }
        }

    }, [selectedCategoryName]);


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
