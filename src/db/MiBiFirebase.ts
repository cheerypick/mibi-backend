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

    public getSubscriptions(companyToGet: string){
        firebase.database().ref('/companies/'+companyToGet).once('value').then(function(snapshot) {
            let subscriptionsArray = snapshot.val().subscribtions;
            let subscriptions:Subscription[] = [];

            for(let subscription in subscriptionsArray){
                console.log("Before sub");{
                    "companies": {
                        "DinBegravelse":
                        {
                            "orgNr": 1234567890,
                            "admin": [
                            {
                                "companyName": "Din Begravelse",
                                "name": "Line Johnsen",
                                "username": "mibi",
                                "password": "mibi",
                                "uuid": "342c5180-d9ab-4419-9c96-ddf907f3558b"
                            }
                        ],
                            "subscriptions": [
                            {
                                "companyName": "Din Begravelse",
                                "name": "Line Johnsen",
                                "phoneNumber": 94685512,
                                "puk": 689461,
                                "dataDefault": 5000,
                                "dataTotal": 5000,
                                "dataUsed": 2312,
                                "dataNotified": false,
                                "priceDefault": 349,
                                "priceTotal": 349,
                                "additionalProducts": []
                            },
                            {
                                "companyName": "Din Begravelse",
                                "name": "John Abrahamsen",
                                "phoneNumber": 41639898,
                                "puk": 456812,
                                "dataDefault": 3000,
                                "dataTotal": 5000,
                                "dataUsed": 4384,
                                "dataNotified": false,
                                "priceDefault": 299,
                                "priceTotal": 499,
                                "additionalProducts": [
                                    {
                                        "productName": "DataPakke 2GB",
                                        "endDate": "2017-04-01T00:00:00.000Z"
                                    }
                                ]
                            },
                            {
                                "companyName": "Din Begravelse",
                                "name": "Tone Fjellheim",
                                "phoneNumber": 91454568,
                                "puk": 124979,
                                "dataDefault": 5000,
                                "dataTotal": 10000,
                                "dataUsed": 7460,
                                "dataNotified": false,
                                "priceDefault": 349,
                                "priceTotal": 599,
                                "additionalProducts": [
                                    {
                                        "productName": "DataPakke 5GB",
                                        "endDate": "2017-04-01T00:00:00.000Z"
                                    }
                                ]
                            }
                        ]
                        },
                        "Smultekjappa":
                        {
                            "orgNr": 7438294511,
                            "admin": [
                            {
                                "companyName": "Smultekjappa",
                                "name": "Ole Nordmann",
                                "username": "smulteringen",
                                "password": "smulteringErBest",
                                "uuid": "e7c82929-b3b1-4fa0-b4bb-ca446cc2e300"
                            }
                        ],
                            "subscriptions": [
                            {
                                "companyName": "Smultekjappa",
                                "name": "Ole Nordmann",
                                "phoneNumber": 45696989,
                                "puk": 126543,
                                "dataDefault": 2000,
                                "dataTotal": 2000,
                                "dataUsed": 437,
                                "dataNotified": false,
                                "priceDefault": 299,
                                "priceTotal": 299,
                                "additionalProducts": []
                            }
                        ]
                        }

                    }
                console.log(subscriptionsArray[subscription]);
            }
        });
    }
}