"use strict";
const MibiWit_1 = require("../wit/MibiWit");
class Client {
    authenticate(io) {
        require('socketio-auth')(io, {
            authenticate: function (socket, data, callback) {
                //get credentials sent by the user
                let username = data.username;
                let password = data.password;
                if (username === 'mibi') {
                    return callback(null, password === 'mibi');
                }
                else {
                    return callback(new Error("User not found"));
                }
            }
        });
    }
    sendMessage(io) {
        io.on('connection', function (socket) {
            console.log('User Connected');
            socket.on('message', function (msg) {
                io.emit('message', msg);
                console.log('got message', msg);
                MibiWit_1.MibiWit.sendMessage(io, msg);
                console.log(msg);
            });
        });
    }
}
exports.Client = Client;
