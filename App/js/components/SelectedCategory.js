import React, {useContext, useEffect, useState} from 'react';
import {useParams,useHistory} from "react-router-dom";
import {withFirebase} from "./Firebase/context";
import Sidebar from "./Sidebar";
import CardUserPost from "./CardUserPost";
import ScrollContext from "./ScrollContext";

const SelectedCategory = (props) => {
    const selectedCategoryName = useParams();
    const [categoryPosts, setCategoryPosts] = useState(null);
    const scrollY = useContext(ScrollContext);
    const history = useHistory();


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
                scrollY.setNewScroll(window.scrollY);
                mounted = false;
            }
        }

    }, [selectedCategoryName]);

    useEffect(() => {
        if(history.action === "POP" && scrollY.scrollPosition > 768){
            setTimeout(() => {
                window.scrollTo(0, scrollY.scrollPosition);
            },2000);
        } else {
            window.scrollTo(0,0);
        }
    },[selectedCategoryName])


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
