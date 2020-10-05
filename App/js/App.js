import React, {useEffect, useState, createContext} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blueGrey from "@material-ui/core/colors/blueGrey";
import {ThemeProvider} from "@material-ui/core/styles";
import * as ROUTES from "./constants/routes";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import {withFirebase} from "./components/Firebase/context";
import AuthUserContext from "./components/SessionContext";
import UserPostsMain from "./components/UserPostsMain";
import {Switch} from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import SelectedPost from "./components/SelectedPost";
import SelectedCategory from "./components/SelectedCategory";
import AdminPage from "./components/AdminPage";
import UserAccountPage from "./components/UserAccountPage";
import PasswordResetPage from "./components/PasswordResetPage";

export const SidebarContext = createContext(null)

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey[900]
        },
        secondary: {
            main: "#2196f3"
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 768,
            lg: 1280,
            xl: 1920
        }
    }
})

const App = (props) => {

    const [authUser, setAuthUser] = useState(null);
    useEffect(() => {
        const listener = props.firebase.onAuthUserListener(authUser => {
            {
                setAuthUser(authUser);
            }
        }, () => {
            setAuthUser(null);
        });

        return () => {
            listener();
        }

    }, []);

    const [sidebarOpen, setSidebar] = useState(false)

    const changeState = () => {
        setSidebar(prev => !prev);
    }

    return (
        <ThemeProvider theme={theme}>
            <AuthUserContext.Provider value={authUser}>
                <SidebarContext.Provider value={{
                    sidebarOpen,
                    setSidebarState: changeState
                }}>
                    <BrowserRouter>
                        <div className="app">
                            <Navbar/>
                            <Switch>
                                <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                                <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
                                <Route path={ROUTES.ACCOUNT} component={UserAccountPage}/>
                                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordResetPage}/>
                                <Route path={ROUTES.ADMIN} component={AdminPage}/>
                                <Route path={ROUTES.POST} component={SelectedPost}/>
                                <Route path={ROUTES.CATEGORY} component={SelectedCategory}/>
                                <Route exact path={ROUTES.HOME} component={UserPostsMain}/>
                                <Route path={ROUTES.NOT_FOUND} component={NotFoundPage}/>
                            </Switch>
                        </div>
                    </BrowserRouter>
                </SidebarContext.Provider>
            </AuthUserContext.Provider>
        </ThemeProvider>
    );
};

export default withFirebase(App);
