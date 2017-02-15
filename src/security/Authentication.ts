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

    public sendMessage(io, client, sessionId, context){
        io.on('connection', function(socket) {
            console.log('User Connected');
            socket.on('message', function(msg){

                io.emit('message', msg);
                console.log('got message', msg)

                client.runActions(
                    sessionId, // the user's current session
                    msg.text, // the user's message
                    context // the user's current session state
                ).then((newContext) => {
                    // Our bot did everything it has to do.
                    // Now it's waiting for further messages to proceed.
                    console.log('Waiting for next user messages');

                    // Based on the session state, you might want to reset the session.
                    // This depends heavily on the business logic of your bot.
                    // Example:
                    // if (context['done']) {
                    //   delete sessions[sessionId];
                    // }

                    // Updating the user's current session state
                    context = newContext;
                })
                    .catch((err) => {
                        console.error('Oops! Got an error from Wit: ', err.stack || err);
                    })


                console.log(msg);

            });
        });
    }
}

