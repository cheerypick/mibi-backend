export class Authentication {
    private username:string;
    private password:string;

    constructor(username:string, password:string) {
        this.username = username;
        this.password = password;
    }

    public authenticate(io){
        require('socketio-auth')(io, {
            authenticate: function (socket, data, callback) {
                //get credentials sent by the client
                var username = data.username;
                var password = data.password;

                if(username==='mibi') {
                    return callback(null, password==='mibi');

                } else {
                    return callback(new Error("User not found"))
                }
            }
        });
    }
}

