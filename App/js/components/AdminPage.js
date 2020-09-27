import React, {useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import Sidebar from "./Sidebar";

const AdminPage = (props) => {

    const [users, setUsers] = useState(null);

    useEffect(() => {
        let mounted = true;
        props.firebase.database.collection("users").onSnapshot(snapshot => {
            if (mounted) {
                setUsers(snapshot.docs);
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

                    <Typography variant="h6">List of users</Typography>
                    <ul>
                        {users && users.map((user, index) => {
                            return <li key={index}>{user.data().username} {user.data().email} {user.id}</li>
                        })}
                    </ul>
                <div>
                    <Typography variant="h6">Suggested categories</Typography>
                </div>
            </div>
        </>
    );
};

const condition = authUser => authUser && authUser.role === "admin";

export default PermissionsContext(condition)(AdminPage);
