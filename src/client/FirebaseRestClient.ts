import {Notification} from "../entities/Notification";
import {PropertyReader} from "../config/PropertyReader";
import server = require("socket.io");
let fetch = require('node-fetch');

export class FirebaseRestClient{

    serverKey:string;

    constructor(){
        let propertyReader = new PropertyReader();
        this.serverKey = propertyReader.getPushNotificationServerKey();
    }

    public postNotification(reciever:string, notification:Notification){
        fetch('https://fcm.googleapis.com/fcm/send', {method:'POST',
            headers: {
            'Authorization': this.serverKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: reciever,
            priority: 'high',
            notification: notification,
            data: {
                title: "title",
                body: "body",
                notId: 10,
                surveyId: "ewtawgreg-gragrag-rgarhthgbad"
            },
        })
        }).then(function (response) {
            console.log("Sending notification to: " + reciever);
            console.log("FirebaseRestClient call -> url: " + response.url +
                        "\nstatus: " + response.statusText + " | " + response.status);
            return response.ok;
        });
    }

}