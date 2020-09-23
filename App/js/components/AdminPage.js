import React from 'react';
import PermissionsContext from "./PermissionsContext";

const AdminPage = () => {
    return (
        <>
            <h1>Admin Page</h1>
            <h2>Hello there Admin</h2>
        </>
    );
};

const condition = authUser => authUser && authUser.role === "admin";

export default PermissionsContext(condition)(AdminPage);
