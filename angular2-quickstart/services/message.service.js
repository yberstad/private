System.register(['./feathers.service.ts', "../node_modules/angular2/core.d"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var feathers_service_ts_1, core_d_1;
    var MessageService;
    return {
        setters:[
            function (feathers_service_ts_1_1) {
                feathers_service_ts_1 = feathers_service_ts_1_1;
            },
            function (core_d_1_1) {
                core_d_1 = core_d_1_1;
            }],
        execute: function() {
            MessageService = (function () {
                function MessageService(_socketService, _restService) {
                    this._socketService = _socketService;
                    this._restService = _restService;
                    // Let's get both the socket.io and REST feathers services for messages!
                    this._rest = _restService.getService('messages');
                    this._socket = _socketService.getService('messages');
                }
                MessageService.prototype.find = function (query) {
                    return this._rest.find(query);
                };
                MessageService.prototype.get = function (id, query) {
                    return this._rest.get(id, query);
                };
                MessageService.prototype.create = function (message) {
                    return this._rest.create(message);
                };
                MessageService.prototype.remove = function (id, query) {
                    return this._socket.remove(id, query);
                };
                MessageService = __decorate([
                    core_d_1.Injectable(), 
                    __metadata('design:paramtypes', [feathers_service_ts_1.SocketService, feathers_service_ts_1.RestService])
                ], MessageService);
                return MessageService;
            }());
            exports_1("MessageService", MessageService);
        }
    }
});
//# sourceMappingURL=message.service.js.map