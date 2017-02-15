import * as http from 'http';
import * as debug from 'debug';
import * as IO from 'socket.io';
import App from './App';
import * as auth from './security/Authentication';
import * as WIT from 'node-wit';
// var mibiWit = require('node-wit').mibiWit;

debug('ts-express:server');

var io = IO();
var Wit = WIT.Wit;

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
        console.log('Yay, got mibiWit.ai response: ' +  JSON.stringify(response.text) );
        console.log('wit said...', response);
    },
};

const client = new Wit({accessToken, actions});

var authUser:auth.Authentication = new auth.Authentication();//("mibi","mibi");
authUser.authenticate(io);
authUser.sendMessage(io, client, sessionId, context);



