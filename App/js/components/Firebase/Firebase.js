import app from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/storage";

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
        this.database = app.firestore();
        this.storage = app.storage();
    }


    newUserEmailAndPassword = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    };

    signInEmailAndPassword = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    };

    signInWithPopupUsingProvider = (provider) => {
        return this.auth.signInWithPopup(provider);
    }

    signOut = () => this.auth.signOut();

    passwordReset = (email) => {
        return this.auth.sendPasswordResetEmail(email);
    };

    updateUserPassword = (password) => {
        return this.auth.currentUser.updatePassword(password);
    };

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.database.collection("users").doc(authUser.uid)
                    .get().then(snapshot => {
                    const databaseUser = snapshot.data();
                    authUser = {
                        uid: authUser.uid,
                        email: authUser.email,
                        ...(databaseUser)
                    }
                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

}

export default Firebase;
