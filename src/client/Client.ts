import {MibiWit} from "../wit/MibiWit";
import {MessageValidator} from "./MessageValidator";
import {MiBiFirebase} from "../db/MiBiFirebase";
import {User} from "../entities/User";

export class Client {

    id = null;

    public authenticate(io, mibiFirebase:MiBiFirebase){
        let username = null;
        let password = null;
        let companyAuth = null;
        require('socketio-auth')(io, {
            authenticate: function(socket, data, callback) {
                //get credentials sent by the client
                username = data.username;
                password = data.password;

                this.id = io.sessionId;

                mibiFirebase.getAdmin(username).then(snapshot => {
                    let userNotFound = snapshot.val() == null;

                    if(userNotFound){
                        return callback(new Error("User not found"));
                    }else{
                        companyAuth = snapshot.val().companyName;
                        return callback(null, password===snapshot.val().password);
                    }
                });
            },
            postAuthenticate: function(socket, data) {
                if(data.token.length > 0){
                    mibiFirebase.updateDeviceTokens(data.username, data.token);
                }
                socket._userInfo = new User(companyAuth, data.username);
            }
        });
    }

    public getMessage(io, propertyReader){
        io.on('connection', function(socket) {
            console.log(socket.id + ' connected');
            socket.on('message', function(msg) {
                console.log(JSON.stringify(socket._userInfo));
                io.to(socket.id).emit('message', msg);

                if(MessageValidator.initiationMessage(msg)){
                    msg.text = 'Hei';
                }

                MibiWit.sendMessage(io, msg, propertyReader, this.id);
                // console.log(msg);
            });
        });
    }
}