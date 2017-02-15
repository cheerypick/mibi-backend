export class PropertyReader {

    private static config = require('../../config.json');

    public static getAccessToken(){
        return this.config.wit.authentication.accessToken;
    }

    public static getServerPort(){
        return this.config.server.connection.port;
    }

    public static getServerHost(){
        return this.config.server.connection.host;
    }
}