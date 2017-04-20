import {Notification} from "../entities/Notification";
import * as _ from 'lodash';

export class DataUsageHelper{

    public static createNotification(name, percentage, phoneNumber): Notification {
        const title = "Varsel om høyt dataforbruk";
        const body =  _.startCase(name) + " har brukt " + percentage + "% av datapakken sin.";
        const witAction = "datausage "+ phoneNumber;

        return new Notification(title, body, witAction);
    }


    public static parsePhoneNumber(path): String {
        let phoneNumber = path.replace(/\/$/, '');

        phoneNumber = phoneNumber.substring(phoneNumber.lastIndexOf('/') + 1);

        return phoneNumber;
    }


    public static createUsageMessage(subscription): String {
        return _.startCase(subscription.name) + ' has now used ' +
            subscription.dataUsed + 'MB of ' + subscription.dataTotal +'MB';
    }


    public static filterAdminsByCompany(admins, company): any{
        let filteredAdmins:any = [];
        for(let admin in admins){
            if(admins[admin].companyName === company){
                filteredAdmins.push(admin);
            }
        }
        return filteredAdmins;
    }

}