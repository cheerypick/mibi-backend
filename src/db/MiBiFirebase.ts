import * as firebase from "firebase";
import {Subscription} from "../entities/Subscription";

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

    public getPuk(companyToGet: string, phone: number){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/phoneNumbers/'+phone).once('value');
    }

    public getSubscriptions(companyToGet: string){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/phoneNumbers').once('value');
    }

    public getSubscription_number(companyToGet: string, phoneNumber: number){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/phoneNumbers/'+phoneNumber).once('value');
    }

    public getNumbers(companyToGet: string, name: string){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/names/'+name).once('value');
    }

    public getAdmins(companyToGet: string){
        return this.db.ref('/companies/'+companyToGet+'/admins').once('value');
    }

    public getAdmin(companyToGet: string, username: string){
        return this.db.ref('/companies/'+companyToGet+'/admins/'+username).once('value');
    }
}