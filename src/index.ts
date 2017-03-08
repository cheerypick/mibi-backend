import * as http from 'http';
import * as debug from 'debug';
import * as IO from 'socket.io';
import App from './App';
import * as client from './client/Client';
import {PropertyReader} from "./config/PropertyReader";

debug('ts-express:server');

let io = IO();
let propertyReader = new PropertyReader();

const port = normalizePort(propertyReader.getServerPort() || process.env.PORT || 3000);

debug('Defined port: ' + port);

App.set('port', port);

const server = http.createServer(App);

server.listen(port, propertyReader.getServerHost());

server.on('error', onError);
server.on('listening', onListening);

io.listen(server);
'use strict';
import {MiBiFirebase} from "./db/MiBiFirebase";


function normalizePort(val: number|string): number {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return 3000;
    else if (port >= 0) return port;
    else return 3000;
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

let user:client.Client = new client.Client();
let mfb = new MiBiFirebase();

mfb.getSubscriptions("Smultekjappa");
user.authenticate(io);
user.getMessage(io, propertyReader);



