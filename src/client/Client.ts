import {MibiWit} from "../wit/MibiWit";

export class Client {

    private id = null;

    public authenticate(io, pr){
        require('socketio-auth')(io, {
            authenticate: function (socket, data, callback) {
                //get credentials sent by the user
                let username = data.username;
                let password = data.password;

                this.id = io.sessionId;
                if(username==='mibi') {
                    return callback(null, password==='mibi');

                } else {
                    return callback(new Error("User not found"))
                }
            }
        });
    }

    public getMessage(io, pr){
        io.on('connection', function(socket) {
            console.log('User Connected');

            socket.on('message', function(msg){

                // io.sockets.connected[this.id].emit('message', msg);
                io.to(this.id).emit('message', msg);
                // io.emit('message', msg);
                console.log('got message', msg)

                MibiWit.sendMessage(io, msg, pr, this.id);

                console.log(msg);

            });
        });
    }
}

