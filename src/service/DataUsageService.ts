import {PushNotificationService} from "./PushNotificationService";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {fbDbReader} from "../index";
import * as _ from 'lodash';
import {DataUtil} from "../util/DataUtil";
import {Notification} from "../entities/Notification";
import {PropertyReader} from "../config/PropertyReader";

export class DataUsageService{

    oldData = {};
    newData = {};

    propertyReader:PropertyReader;
    fbDatabaseReader:FirebaseDatabaseReader;
    pushNotificationService:PushNotificationService;

    constructor(){
        this.propertyReader = new PropertyReader();
        this.fbDatabaseReader = fbDbReader;
        this.pushNotificationService = new PushNotificationService();
    }

    public handleDataUsageUpdates(): void {
        this.fbDatabaseReader.getDataUpdates().on('value', (snapshot) => {
            this.newData = snapshot.val();

            let response = DataUtil.isDataUsageUpdated(this.oldData, this.newData);

            if(response.isDataUpdated){
                this.fbDatabaseReader.getSpecificPath(response.path).then((subscription) => {
                    this.logUsage(subscription);

                    let phoneNumber = this.parsePhoneNumber(response.path);
                    let percentageUsed = DataUtil.calculateDataPercentage(subscription.dataUsed, subscription.dataTotal);

                    if(percentageUsed > this.propertyReader.getDataBeforeNotification()){
                        this.fbDatabaseReader.persistUpdate(subscription.companyName, phoneNumber, response.path);

                        this.fbDatabaseReader.getAdmins().then((admins) => {
                            let filteredAdmins = this.filterAdmins(admins, subscription.companyName);

                            let notification = this.createNotification(subscription.name, percentageUsed, phoneNumber);

                            this.sendNotificationToAdmins(filteredAdmins, notification);
                        });
                    }
                });
            }

            this.oldData = snapshot.val();
        });
    }


    private createNotification(name, percentage, phoneNumber): Notification {
        const title = "Varsel om høyt dataforbruk";
        const body =  _.startCase(name) + " har brukt " + percentage + "% av datapakken sin.";
        const witAction = "datausage "+ phoneNumber;

        return new Notification(title, body, witAction);
    }


    private sendNotificationToAdmins(admins, notification): void {
        for(let admin in admins){
            console.log('Sending a notification to ' + admins[admin]);
            this.pushNotificationService.sendNotificationToUserDevices(admins[admin],notification);
        }
    }


    private parsePhoneNumber(path): String {
        let phoneNumber = path.replace(/\/$/, '');

        phoneNumber = phoneNumber.substring(phoneNumber.lastIndexOf('/') + 1);

        return phoneNumber;
    }


    private logUsage(subscription): void {
        console.log(_.startCase(subscription.name) + ' has now used ' +
                    subscription.dataUsed + 'MB of ' + subscription.dataTotal +'MB');
    }


    private filterAdmins(admins, company): any{
        let filteredAdmins:any = [];
        for(let admin in admins){
            if(admins[admin].companyName === company){
                filteredAdmins.push(admin);
            }
        }
        return filteredAdmins;
    }
}