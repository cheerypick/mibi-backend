import {mibiWit} from "../wit/Wit";

export class Authentication {

    public authenticate(io){
        require('socketio-auth')(io, {
            authenticate: function (socket, data, callback) {
                //get credentials sent by the client
                let username = data.username;
                let password = data.password;

                if(username==='mibi') {
                    return callback(null, password==='mibi');

                } else {
                    return callback(new Error("User not found"))
                }
            }
        });
    }

    public sendMessage(io, client, sessionId, context){
        io.on('connection', function(socket) {
            console.log('User Connected');
            socket.on('message', function(msg){

                io.emit('message', msg);
                console.log('got message', msg)

                mibiWit.sendMessage(client, sessionId, msg, context);

                console.log(msg);

            });
        });
    }
}

