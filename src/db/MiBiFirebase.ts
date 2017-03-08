import * as firebase from "firebase";

export class MiBiFirebase{
    private config = {
        apiKey: "AIzaSyANOj9JDBYXAYgqXl5sE58xpw1IVG9CudM",
        authDomain: "mibi-55bb1.firebaseapp.com",
        databaseURL: "https://mibi-55bb1.firebaseio.com",
        storageBucket: "mibi-55bb1.appspot.com",
        messagingSenderId: "271655106157"
    };
    private db = null;

    constructor(){
        firebase.initializeApp(this.config);
        this.db = firebase.database();
    }

    public getUsers(){
        return firebase.database().ref('/user/').once('value').then(function(snapshot) {
            console.log(snapshot.val());
        });
    }
}