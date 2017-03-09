import {MibiWit} from "../wit/MibiWit";
import {MessageValidator} from "./MessageValidator";
import {MiBiFirebase} from "../db/MiBiFirebase";
import {User} from "../entities/User";

export class Client {

    id = null;

    public authenticate(io, mibiFirebase:MiBiFirebase, users){//: User[]){
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
                 console.log("Adding to users");
                 users[socket.id] = new User(companyAuth, data.username);
                 console.log(users);
            }
        });
    }

    public getMessage(io, propertyReader, users){//: User[]){
        io.on('connection', function(socket) {
            socket.on('message', function(msg) {
                console.log('ID that message has: '+this.id);
                console.log('users: '+JSON.stringify(users));
                io.to(this.id).emit('message', msg);
                // console.log('got message', msg);

                if(MessageValidator.initiationMessage(msg)){
                    msg.text = 'Hei';
                }

                MibiWit.sendMessage(io, msg, propertyReader, this.id);
                console.log(msg);
            });
        });
    }
}




// let found = false;
// users.filter(user => {
//    if(data.username === username){
//        user = socket.id;
//        found = true;
//    }
// });
//
// if(!found){
//     users.push(socket.id);
//     users[socket.id] = new User();
// }