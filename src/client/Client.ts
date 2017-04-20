import {MibiWit} from "../wit/MibiWit";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {User} from "../entities/User";

export class Client {
    username = '';
    password = '';

    public authenticate(io, mibiFirebase:FirebaseDatabaseReader){
        let companyAuth = null;
        require('socketio-auth')(io, {
            authenticate: function(socket, data, callback) {
                this.username = data.username;
                this.password = data.password;

                mibiFirebase.getAdmin(this.username).then(snapshot => {
                    let userNotFound = snapshot == null;

                    if(userNotFound){
                        return callback(new Error("User not found"));
                    }else{
                        companyAuth = snapshot.companyName;
                        return callback(null, this.password === snapshot.password);
                    }
                });
            },
            postAuthenticate: (socket, data) => {
                if(data.token && data.token.length > 0){
                    mibiFirebase.updateDeviceTokens(data.username, data.token);
                }
                socket._userInfo = new User(companyAuth, data.username, data.token);

            },
            disconnect: (socket, data) => {
                if (socket && socket._userInfo && socket._userInfo.username){
                    console.log(socket._userInfo.username + ' has disconnected');
                    // mibiFirebase.removeDeviceToken(socket._userInfo.username, socket._userInfo.token);
                } else {
                    console.log('An unidentified user has disconnected');
                }
            }
        });
    }

    public getMessage(io, propertyReader, mibiFirebase:FirebaseDatabaseReader){
        io.on('connection', (socket) => {
            socket.on('message', (msg) => {

                if(!msg.hidden && socket._userInfo){
                    mibiFirebase.postMessage(socket['_userInfo'].username, msg);
                }else if(!socket._userInfo){
                    console.log('Corrupted socket, forcing user to reconnect!');
                    io.to(socket.id).emit('message', {text: 'reauthenticate', hidde: true});
                    socket.disconnect();
                }

                if(socket._userInfo) {
                    MibiWit.sendMessage(io, msg, propertyReader, socket, mibiFirebase, socket['_userInfo'].username);
                }
            });
        });
    }
}