import React, {useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";

const AdminPage = (props) => {

    const [users, setUsers] = useState(null);

    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("users").onSnapshot(snapshot => {
            if(mounted) {
                setUsers(snapshot.docs);
            }
        })

        return () => {
            mounted = false;
        }
    },[]);

    return (
        <div className="admin__page container">
            <Typography variant="h3">Admin Page</Typography>
            <Typography variant="h5">Hello there Admin</Typography>

            <ul>
                {users && users.map((user, index) => {
                    return <li key={index}>{user.data().username} {user.data().email} {user.id}</li>
                })}
            </ul>
        </div>
    );
};

const condition = authUser => authUser && authUser.role === "admin";

export default PermissionsContext(condition)(AdminPage);
