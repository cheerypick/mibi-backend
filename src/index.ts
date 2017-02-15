import * as http from 'http';
import * as debug from 'debug';
var io = require('socket.io')();
import App from './App';
import * as auth from './security/Authentication';
var Wit = require('node-wit').Wit;

debug('ts-express:server');

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

io.listen(server);'use strict';

function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}


const accessToken = (() => {
    /*
    if (process.argv.length !== 3) {
        console.log('usage: node examples/basic.js <wit-access-token>');
        process.exit(1);
    }*/
    return "FCK4QSTUY2XYMRLWFXYOBOECNNGYDHCY";
})();

var context = {};

var sessionId = 'xep';

const actions = {
    send(request, response) {
        const {sessionId, context, entities} = request;
        const {text, quickreplies} = response;
        console.log(request);
        console.log('user said...', request.text);
        //io.sockets.emit('message', JSON.stringify(response.text));
        io.emit('message', response);
        console.log('Yay, got Wit.ai response: ' +  JSON.stringify(response.text) );
        console.log('wit said...', response);
    },
};

const client = new Wit({accessToken, actions});

var authUser:auth.Authentication = new auth.Authentication("mibi","mibi");
authUser.authenticate(io);

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

