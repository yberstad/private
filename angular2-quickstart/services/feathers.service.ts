const feathers = require('feathers/client');
const socketio = require('feathers-socketio/client');
const io = require('socket.io-client');
const localstorage = require('feathers-localstorage');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest/client');
const authentication = require('feathers-authentication/client');

import { Injectable } from '../node_modules/angular2/core.d';
const superagent = require('superagent');

const HOST = 'http://localhost:3000'; // Your base server URL here
@Injectable()
export class RestService {
    private _app: any;
    constructor() {
        this._app = feathers() // Initialize feathers
            .configure(rest(HOST).superagent(superagent)) // Fire up rest
            .configure(hooks()) // Configure feathers-hooks
    }
}

@Injectable()
export class SocketService extends Service {
    public socket: SocketIOClient.Socket;
    private _app: any;

    constructor() {
        super();
        this.socket = io(HOST);
        this._app = feathers()
            .configure(socketio(this.socket))
            .configure(hooks())
    }
}