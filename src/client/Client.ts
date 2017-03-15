import {MibiWit} from "../wit/MibiWit";
import {MessageValidator} from "./MessageValidator";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {User} from "../entities/User";

export class Client {

    public authenticate(io, mibiFirebase:FirebaseDatabaseReader){
        let username = null;
        let password = null;
        let companyAuth = null;
        require('socketio-auth')(io, {
            authenticate: function(socket, data, callback) {
                //get credentials sent by the client
                username = data.username;
                password = data.password;

                mibiFirebase.getAdmin(username).then(snapshot => {
                    let userNotFound = snapshot == null;

                    if(userNotFound){
                        return callback(new Error("User not found"));
                    }else{
                        companyAuth = snapshot.companyName;
                        return callback(null, password===snapshot.password);
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

    public getMessage(io, propertyReader, mibiFirebase:FirebaseDatabaseReader){
        io.on('connection', function(socket) {
            console.log(socket.id + ' connected');
            socket.on('message', function(msg) {
                console.log(msg);
                io.to(socket.id).emit('message', msg);

                if(MessageValidator.initiationMessage(msg)){
                    msg.text = 'Hei';
                }

                MibiWit.sendMessage(io, msg, propertyReader, socket, mibiFirebase);
                // console.log(msg);
            });
        });
    }
}