import {FirebaseRestClient} from "../client/FirebaseRestClient";
import {Notification} from "../entities/Notification";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {fbDbReader} from "../index";

/**
 *
 */

export class PushNotificationService{

    readonly IOS = "/topics/ios";
    readonly ANDROID = "/topics/android";

    fbRestClient:FirebaseRestClient;
    fbDatabaseReader:FirebaseDatabaseReader;

    constructor(){
        this.fbRestClient = new FirebaseRestClient();
        this.fbDatabaseReader = fbDbReader;
    }

    public sendNotificationToAllUsers(notification:Notification){
        this.fbRestClient.postNotification(this.IOS, notification);
        this.fbRestClient.postNotification(this.ANDROID, notification);
    }

    public sendNotificationToUserDevices(username:string, notification:Notification){
        this.fbDatabaseReader.getDeviceTokens(username).then((tokens) => {
            let tokenMap = tokens.val();

            for (let key in tokenMap) {
                let currentToken = tokenMap[key];
                this.fbRestClient.postNotification(currentToken, notification);
            }
        });
    }

}