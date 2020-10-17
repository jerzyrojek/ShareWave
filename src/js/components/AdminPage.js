import React, {useEffect, useState} from 'react';
import PermissionsContext from "./PermissionsContext";
import {Typography} from "@material-ui/core";
import Sidebar from "./Sidebar";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        margin: "1rem auto",
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.3)",
        [theme.breakpoints.up("sm")]: {
            width: "600px"
        }
    },
    labels: {
        fontWeight: "bold",
    },
    item: {
        display: "flex",
        flexDirection: "column",
        border: `1px solid #eceff1`,
        marginBottom: "1rem",
    },
    category: {
        margin: "0.5rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        border: `1px solid #eceff1`,
    },
    approve: {
        "&:hover": {
            backgroundColor: "#1b5e20",

        },
        backgroundColor: "#4caf50",
    },
    delete: {
        "&:hover": {
            backgroundColor: "#b71c1c",

        },
        backgroundColor: "#f44336",
    }
}));

const AdminPage = (props) => {
    const classes = useStyles();
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
                if (mounted) {
                    setSuggestedCategories(snapshot.docs)
                }
            })

        return () => {
            mounted = false;
            setSuggestedCategories(null);
        }
    }, []);

    const handleDeleteSuggested = (docId) => {
        props.firebase.database.collection("suggested").doc(docId)
            .delete()
            .then(() => {
                console.log("deleted!")
            })
    }

    const handleAddSuggested = (docId, categoryName) => {
        props.firebase.database.collection("categories").doc(categoryName).set({
            name: categoryName,
        }).then(() => {
            props.firebase.database.collection("suggested").doc(docId)
                .delete()
                .then(() => {
                    console.log("deleted!")
                })
        })
    }

    return (
        <>
            <Sidebar/>
            <div className="admin__page container">
                <Card className={classes.root}>
                    <Typography color="secondary" variant="h3">Admin Page</Typography>
                    <Typography variant="h5">Hello there Admin</Typography>

                    <Typography className={classes.labels} color="secondary" variant="h5">List of users</Typography>
                    <List>
                        {users && users.map((user, index) => {
                            return <ListItem className={classes.item} key={index}><p>{user.data().username}</p>
                                <p>{user.data().email}</p> <p>{user.id}</p></ListItem>
                        })}
                    </List>
                    {suggestedCategories && suggestedCategories.length > 0 && <div className="suggestedCategories">
                        <Typography className={classes.labels} color="secondary" variant="h5">Suggested
                            categories</Typography>
                        {suggestedCategories.map((category) => {
                            return (
                                <div className={classes.category} key={category.id}>
                                    <Typography variant="h6">{category.data().name}</Typography>
                                    <p>{category.data().description}</p>
                                    <div className="suggestedCategories__controls">
                                        <Button className={classes.approve} variant="contained"
                                                onClick={() => handleAddSuggested(category.id, category.data().name)}>Approve</Button>
                                        <Button className={classes.delete} variant="contained"
                                                onClick={() => handleDeleteSuggested(category.id)}>Delete</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </Card>
            </div>
        </>
    );
};

const condition = authUser => authUser && authUser.role === "admin";

export default PermissionsContext(condition)(AdminPage);
