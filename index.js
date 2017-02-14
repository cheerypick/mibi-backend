var http = require('http'),
    server = http.createServer();

var io = require('socket.io').listen(server);'use strict';

let Wit = null;
let interactive = null;
try {
    // if running from repo
    Wit = require('../').Wit;
    interactive = require('../').interactive;
} catch (e) {
    Wit = require('node-wit').Wit;
    interactive = require('node-wit').interactive;
}

const accessToken = (() => {
        if (process.argv.length !== 3) {
    console.log('usage: node examples/basic.js <wit-access-token>');
    process.exit(1);
}
return process.argv[2];
})();

var context = {};

var sessionId = 'xep'

const actions = {
    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        console.log('user said...', request.text);
        io.emit('message', JSON.stringify(response.text));
        console.log('Yay, got Wit.ai response: ' +  JSON.stringify(response.text) );
        console.log('wit said...', response);
    },
};

const client = new Wit({accessToken, actions});


require('socketio-auth')(io, {
    authenticate: function (socket, data, callback) {
        //get credentials sent by the client
        var username = data.username;
        var password = data.password;

        if(username==='kasyametrik') {
            return callback(null, password==='her');

        } else {
            return callback(new Error("User not found"))
        }


    }
});

io.on('connection', function(socket) {
    console.log('User Connected');
    socket.on('message', function(msg){

        io.emit('message', msg);

        client.runActions(
            sessionId, // the user's current session
            msg, // the user's message
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

server.listen(3000, function(){
    console.log('Server started');
})