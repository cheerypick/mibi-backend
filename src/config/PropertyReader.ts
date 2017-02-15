export class PropertyReader {

    private config = null;

    constructor(){
        try{
            this.config = require('../../config.json');
        }catch(e){
            console.log('Could not find the configuration file!');
            console.log('Shutting down!');
            process.exit(-1);
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
}