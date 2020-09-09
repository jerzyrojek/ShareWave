import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blueGrey from "@material-ui/core/colors/blueGrey";
import {ThemeProvider} from "@material-ui/core/styles";
import * as ROUTES from "./constants/routes";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: blueGrey[900]
        },
        secondary: {
            main: "#ff3d00"
        },
    },
})

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Navbar/>
                <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
            </BrowserRouter>
        </ThemeProvider>


    );
};

export default App;
