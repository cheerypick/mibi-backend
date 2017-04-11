import {PushNotificationService} from "./PushNotificationService";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {fbDbReader} from "../index";
import * as _ from 'lodash';
import {DataUtil} from "../util/DataUtil";
import {Notification} from "../entities/Notification";
import {PropertyReader} from "../config/PropertyReader";
import {DataUsageHelper} from "./DataUsageHelper";

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

            if(response.isDataUpdate){
                this.fbDatabaseReader.getSpecificPath(response.path).then((subscription) => {
                    console.log(DataUsageHelper.createUsageMessage(subscription));

                    let phoneNumber = DataUsageHelper.parsePhoneNumber(response.path);
                    let percentageUsed = DataUtil.calculateDataPercentage(subscription.dataUsed, subscription.dataTotal);

                    if(percentageUsed > this.propertyReader.getDataBeforeNotification()){
                        this.fbDatabaseReader.persistUpdate(subscription.companyName, phoneNumber, response.path);
                        this.handleNotifications(subscription, percentageUsed, phoneNumber);
                    }
                });
            }

            this.oldData = snapshot.val();
        });
    }


    private handleNotifications(subscription, percentageUsed, phoneNumber){
        this.fbDatabaseReader.getAdmins().then((admins) => {
            let filteredAdmins = DataUsageHelper.filterAdminsByCompany(admins, subscription.companyName);

            let notification = DataUsageHelper.createNotification(subscription.name, percentageUsed, phoneNumber);

            this.pushNotificationService.sendNotificationToAdmins(filteredAdmins, notification);
        });
    }
}