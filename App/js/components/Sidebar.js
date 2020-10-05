import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import {withFirebase} from "./Firebase/context";
import CategoryIcon from '@material-ui/icons/Category';
import {useHistory} from "react-router-dom";
import AuthUserContext from "./SessionContext";
import CategorySuggestionModal from "./CategorySuggestionModal";
import useTheme from "@material-ui/core/styles/useTheme";
import Hidden from "@material-ui/core/Hidden";
import {SidebarContext} from "../App";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0,
        }
    },
    drawerPaper: {
        width: drawerWidth,
        top: "64px",
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: {
        minHeight: "40px",
    },
}));

const Sidebar = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const [categories, setCategories] = useState(null);
    const {sidebarOpen, setSidebarState} = useContext(SidebarContext);


    const drawerContent = (
        <div className={classes.drawerContainer}>
            <List>
                <AuthUserContext.Consumer>
                    {authUser => authUser && authUser.role === "admin" ?
                        <ListItem button onClick={handleClickAddCategory}>
                            <ListItemIcon><AddBoxRoundedIcon/></ListItemIcon>
                            <ListItemText primary="Add a Category"/>
                        </ListItem>
                        :
                        <CategorySuggestionModal/>
                    }
                </AuthUserContext.Consumer>

                <Divider/>
                <ListItem>
                    <ListItemIcon><CategoryIcon/></ListItemIcon>
                    <ListItemText primary="Categories"/>
                </ListItem>
                <Divider/>
                {categories && categories.map((category, index) => {
                    return <ListItem button key={index} onClick={() => handleSelectCategory(category)}>
                        <ListItemText primary={category.name}/>
                    </ListItem>
                })
                }
            </List>
        </div>
    )

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
        if (category) {
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
            <Hidden lgUp implementation="js">
                <Drawer
                    className={classes.drawer}
                    variant="temporary"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    open={sidebarOpen}
                    onClose={setSidebarState}
                    ModalProps={{keepMounted: true}}
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    {drawerContent}
                </Drawer>
            </Hidden>
            <Hidden mdDown implementation="js">
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    {drawerContent}
                </Drawer>
            </Hidden>
        </div>
    );
}

export default withFirebase(Sidebar);

