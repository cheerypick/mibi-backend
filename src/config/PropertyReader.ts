import {FireBaseConfig} from "../entities/FireBaseConfig";
export class PropertyReader {

    private config = null;

    constructor(){
        try{
            this.config = require('../../config.json');
        }catch(e){
            console.log('Could not find the configuration file!');
            console.log('Shutting down!');
            process.exit(0);
        }
    }

    public getProductionFireBaseConfiguration():FireBaseConfig{
        return this.readFireBaseConfiguration(this.config.firebaseProduction);
    }

    public getAdrianoFireBaseConfiguration():FireBaseConfig{
        return this.readFireBaseConfiguration(this.config.firebaseAdriano);
    }

    public getAccessToken(){
        return this.config.wit.authentication.accessToken;
    }

    public getServerPort(){
        return this.config.server.connection.port;
    }

    public getServerHost(){
        return this.config.server.connection.host;
    }

    public getPushNotificationServerKey(){
        return this.config.pushNotificationSetup.serverKey;
    }

    private readFireBaseConfiguration(config):FireBaseConfig{
        let fireBaseConfig:FireBaseConfig = {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId
        };

        return fireBaseConfig;
    }
}