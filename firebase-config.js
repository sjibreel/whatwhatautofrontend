import firebase from 'firebase'


let app
const config = {
    apiKey: "AIzaSyDgfMh7lK4FyVih-HPPl4hWHOMDC0m8_xM",
    authDomain: "whatwhatauto-5b457.firebaseapp.com",
    databaseURL: "https://whatwhatauto-5b457.firebaseio.com",
    projectId: "whatwhatauto-5b457",
    storageBucket: "whatwhatauto-5b457.appspot.com",
    messagingSenderId: "16288178301"
 };

if (!firebase.apps.length) {
    app = firebase.initializeApp(config);
}

export default app