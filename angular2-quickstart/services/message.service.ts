import { RestService, SocketService } from './feathers.service.ts';
import {Injectable} from "../node_modules/angular2/core.d";

@Injectable()
export class MessageService {
    private _socket;
    private _rest;

    constructor(

        private _socketService: SocketService,
        private _restService: RestService
    ) {
        // Let's get both the socket.io and REST feathers services for messages!
        this._rest = _restService.getService('messages');
        this._socket = _socketService.getService('messages');
    }

    find(query: any) {
        return this._rest.find(query);
    }

    get(id: string, query: any) {
        return this._rest.get(id, query);
    }

    create(message: any) {
        return this._rest.create(message);
    }

    remove(id: string, query: any) {
        return this._socket.remove(id, query);
    }
}