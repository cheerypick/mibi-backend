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

    public getAccessToken(){
        return this.config.wit.authentication.accessToken;
    }

    public getServerPort(){
        return this.config.server.connection.port;
    }

    public getServerHost(){
        return this.config.server.connection.host;
    }

    public getFirebaseApiKey(){
        return this.config.firebase.apiKey;
    }

    public getFirebaseAuthDomain(){
        return this.config.firebase.authDomain;
    }

    public getFirebaseDatabaseURL(){
        return this.config.firebase.databaseURL;
    }

    public getFirebaseStorageBucket(){
        return this.config.firebase.storageBucket;
    }

    public getFirebaseMessagingSenderId(){
        return this.config.firebase.messagingSenderId;
    }
}