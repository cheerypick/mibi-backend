import {FirebaseRestClient} from "../client/FirebaseRestClient";
import {Notification} from "../entities/Notification";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {fbDbReader} from "../index";

/**
 * Example usage of class:
 * let pushNotificationService = new PushNotificationService();
 * let result = pushNotificationService.sendNotificationToAll(new Notification("From web", "Only a test", "No action"));
 */
export class PushNotificationService{

    readonly ALL = "/topics/all";
    readonly IOS = "/topics/ios";
    readonly ANDROID = "/topics/android";

    fbRestClient:FirebaseRestClient;
    fbDatabaseReader:FirebaseDatabaseReader;

    constructor(){
        this.fbRestClient = new FirebaseRestClient();
        this.fbDatabaseReader = fbDbReader;
    }

    public sendNotificationToAll(notification:Notification){
        this.fbRestClient.postNotification(this.ALL, notification);
    }

    public sendNotificationToIos(notification:Notification){
        this.fbRestClient.postNotification(this.IOS, notification);
    }

    public sendNotificationToAndroid(notification:Notification){
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