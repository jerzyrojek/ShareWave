import app from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};


class Firebase {
    constructor() {
        app.initializeApp(config)
        // app.analytics();

        this.auth = app.auth();
    }


    newUserEmailAndPassword = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    };

    signInEmailAndPassword = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    };

    signInWithGoogle = () => {
        // return this.auth.signInWithPopup()
    }

    signOut = () => this.auth.signOut();

    passwordReset = (email) => {
        return this.auth.sendPasswordResetEmail(email);
    };

    updateUserPassword = (password) => {
        return this.auth.currentUser.updatePassword(password);
    };

}

export default Firebase;
