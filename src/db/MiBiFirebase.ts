import {Subscription} from "../entities/Subscription";
import {PropertyReader} from "../config/PropertyReader";
import * as firebase from "firebase";


/*
To get data call the function like this:
getMyVariable(necessary,variables).then(function(snapshot){
    let foo = snapshot.val();
    foo.dataTotal
    ...
});
 */
export class MiBiFirebase{

    private db = null;
    private propertyReader = new PropertyReader();

    constructor(){
        //let config = this.propertyReader.getAdrianoFireBaseConfiguration();
        let config = this.propertyReader.getProductionFireBaseConfiguration();

        firebase.initializeApp(config);
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

    public getAdminsForCompany(companyToGet: string){
        return this.db.ref('/companies/'+companyToGet+'/admins').once('value');
    }

    public getAdmin(username: string){
        return this.db.ref('/admins/'+username).once('value');
    }

    public updatePassword(companyToEdit: string, username: string, newPassword: string){
        this.db.ref('/companies/'+companyToEdit+'/admins/'+username).update({password: newPassword});
    }

    public getDeviceTokens(username: string){
        return this.db.ref('/admins/'+username+'/tokens').once('value');
    }

    public updateDeviceTokens(username: string, token:string){
        this.getDeviceTokens(username).then((tokens) => {
            let tokenFound:boolean = false;
            let tokenMap = tokens.val();

           for(let key in tokenMap){
               let currentToken = tokenMap[key];
               if(currentToken === token){
                   tokenFound = true;
               }
           }

            if(tokenFound == false){
                this.db.ref('/admins/'+username+'/tokens/').push(token);
            }
        });
    }
}