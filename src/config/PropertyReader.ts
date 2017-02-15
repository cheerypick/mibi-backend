import * as PR from 'properties-reader';

export class PropertyReader {

    private properties = null;

    constructor(){
        this.properties = PR('config.ini');
    }

    public getAccessToken(){
        return this.properties.getRaw('wit.authentication.access.token');
    }

    public getServerPort(){
        return this.properties.getRaw('server.connection.port');
    }

    public getServerHost(){
        return this.properties.getRaw('server.connection.host');
    }
}