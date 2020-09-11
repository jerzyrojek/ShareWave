import React from 'react';
import CardUserPost from "./CardUserPost";
import Sidebar from "./Sidebar";

const UserPostsMain = () => {
    return (
       <div className="app__body">
            <div className="app_sidebar">
                <Sidebar/>
            </div>
           <div className="userPosts container">
               <CardUserPost/>
               <CardUserPost/>
               <CardUserPost/>
               <CardUserPost/>
           </div>
       </div>
    );
};

export default UserPostsMain;
