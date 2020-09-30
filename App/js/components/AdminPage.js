import React, {useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import Sidebar from "./Sidebar";

const AdminPage = (props) => {

    const [users, setUsers] = useState(null);
    const [suggestedCategories, setSuggestedCategories] = useState(null);

    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("users").onSnapshot(snapshot => {
            if (mounted) {
                setUsers(snapshot.docs);
            }
        })

        props.firebase.database.collection("suggested")
            .orderBy("timestamp", "asc")
            .onSnapshot(snapshot => {
            if(mounted){
                setSuggestedCategories(snapshot.docs)
            }
        })

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <>
            <Sidebar/>
            <div className="admin__page container">
                <Typography variant="h3">Admin Page</Typography>
                <Typography variant="h5">Hello there Admin</Typography>

                    <Typography variant="h5">List of users</Typography>
                    <ul>
                        {users && users.map((user, index) => {
                            return <li key={index}>{user.data().username} {user.data().email} {user.id}</li>
                        })}
                    </ul>
                <div className="suggestedCategories">
                    <Typography variant="h5">Suggested categories</Typography>
                    {suggestedCategories && suggestedCategories.map((category) => {
                        return (
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center"}} key={category.id}>
                                <Typography variant="h6">{category.data().name}</Typography>
                                <p>{category.data().description}</p>
                                <div className="suggestedCategories__controls">
                                    <button>Add</button>
                                    <button>Delete</button>
                                </div>

                            </div>
                            )
                    })}
                </div>
            </div>
        </>
    );
};

const condition = authUser => authUser && authUser.role === "admin";

export default PermissionsContext(condition)(AdminPage);
