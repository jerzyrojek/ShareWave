import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import Firebase from "./components/Firebase/Firebase";
import FirebaseContext from "./components/Firebase/context"
import "../scss/main.scss";



ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App/>
    </FirebaseContext.Provider>,
    document.querySelector("#root")
);
