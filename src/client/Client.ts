import {MibiWit} from "../wit/MibiWit";
import {MessageValidator} from "./MessageValidator";

export class Client {

    private id = null;

    public authenticate(io){
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

    public getMessage(io, propertyReader){
        io.on('connection', function(socket) {
            console.log('User Connected');

            socket.on('message', function(msg){

                io.to(this.id).emit('message', msg);
                console.log('got message', msg);

                if(MessageValidator.initiationMessage(msg)){
                    msg.text = 'datausage';
                }

                MibiWit.sendMessage(io, msg, propertyReader, this.id);

                console.log(msg);

            });
        });
    }
}

