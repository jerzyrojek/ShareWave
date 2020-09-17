import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import {withFirebase} from "./Firebase/context";
import CategoryIcon from '@material-ui/icons/Category';
import {useHistory} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const Sidebar = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        props.firebase.database.collection("categories")
            .orderBy("name", "asc")
            .onSnapshot(snapshot => {
                setCategories(snapshot.docs.map((doc) => ({
                    name: doc.data().name,
                    id: doc.id,
                })));
            })
    }, []);

    const handleSelectCategory = (category) => {
            if(category){
                history.push(`/category/${category.name}`);
            }
    }

    const handleClickAddCategory = () => {
        const categoryName = prompt("Enter the category name");

        if (categoryName) {
            props.firebase.database.collection("categories").doc(categoryName).set({
                name: categoryName,
            })
        }
    }

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <Toolbar/>
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem button onClick={handleClickAddCategory}>
                            <ListItemIcon><AddBoxRoundedIcon/></ListItemIcon>
                            <ListItemText primary="Add Category"/>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                            <ListItemIcon><CategoryIcon/></ListItemIcon>
                            <ListItemText primary="Categories"/>
                        </ListItem>
                        <Divider/>
                        {categories && categories.map((category, index) => {
                            return <ListItem button key={index} onClick={() => handleSelectCategory(category)}>
                                {/*<ListItemIcon></ListItemIcon>*/}
                                {/*need to figure out if I want icons here or not*/}
                                <ListItemText primary={category.name}/>
                            </ListItem>
                        })
                        }
                    </List>
                </div>
            </Drawer>
        </div>
    );
}

export default withFirebase(Sidebar);

