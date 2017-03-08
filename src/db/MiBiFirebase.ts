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

    public updatePuk(companyToEdit: string, phone: number, newPuk: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phone).update({puk: newPuk});
    }

    public getSubscriptions(companyToGet: string){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/phoneNumbers').once('value');
    }

    public getSubscription(companyToGet: string, phoneNumber: number){
        return this.db.ref('/companies/'+companyToGet+'/subscriptions/phoneNumbers/'+phoneNumber).once('value');
    }

    public addProduct(companyToEdit: string, phoneNumber: number, productName: string, dataTotal:number, priceTotal: number, endDate: Date){
        /*Example of how to set the date to the first of the next month:
         let date = new Date();
         date.setUTCMonth(date.getMonth()+1,1);
         date.setUTCHours(0,0,0,0)
         */
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).update({dataTotal: dataTotal, priceTotal: priceTotal});
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber+'/additionalProducts/').push({productName: productName,endDate: endDate.toISOString()});
    }

    public updateDataDefault(companyToEdit: string, phoneNumber: number, dataDefault: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).update({dataDefault: dataDefault});
    }

    public updateDataTotal(companyToEdit: string, phoneNumber: number, dataTotal: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).update({dataTotal: dataTotal});
    }

    public updatePriceDefault(companyToEdit: string, phoneNumber: number, priceDefault: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).update({priceDefault: priceDefault});
    }

    public updatePriceTotal(companyToEdit: string, phoneNumber: number, priceTotal: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).update({priceTotal: priceTotal});
    }

    public deleteSubscription(companyToEdit: string, phoneNumber: number){
        this.db.ref('/companies/'+companyToEdit+'/subscriptions/phoneNumbers/'+phoneNumber).remove();
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

    public updatePassword(companyToEdit: string, username: string, newPassword: string){
        this.db.ref('/companies/'+companyToEdit+'/admins/'+username).update({password: newPassword});
    }
}