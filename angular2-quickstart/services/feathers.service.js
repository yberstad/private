System.register(['../node_modules/angular2/core.d'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_d_1;
    var feathers, socketio, io, localstorage, hooks, rest, authentication, superagent, HOST, RestService, SocketService;
    return {
        setters:[
            function (core_d_1_1) {
                core_d_1 = core_d_1_1;
            }],
        execute: function() {
            feathers = require('feathers/client');
            socketio = require('feathers-socketio/client');
            io = require('socket.io-client');
            localstorage = require('feathers-localstorage');
            hooks = require('feathers-hooks');
            rest = require('feathers-rest/client');
            authentication = require('feathers-authentication/client');
            superagent = require('superagent');
            HOST = 'http://localhost:3000'; // Your base server URL here
            RestService = (function () {
                function RestService() {
                    this._app = feathers() // Initialize feathers
                        .configure(rest(HOST).superagent(superagent)) // Fire up rest
                        .configure(hooks()); // Configure feathers-hooks
                }
                RestService = __decorate([
                    // Your base server URL here
                    core_d_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], RestService);
                return RestService;
            }());
            exports_1("RestService", RestService);
            SocketService = (function (_super) {
                __extends(SocketService, _super);
                function SocketService() {
                    _super.call(this);
                    this.socket = io(HOST);
                    this._app = feathers()
                        .configure(socketio(this.socket))
                        .configure(hooks());
                }
                SocketService = __decorate([
                    core_d_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SocketService);
                return SocketService;
            }(Service));
            exports_1("SocketService", SocketService);
        }
    }
});
//# sourceMappingURL=feathers.service.js.map