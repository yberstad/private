import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {SocketService, RestService} from "./../services/feathers.service.ts";

bootstrap(AppComponent, [SocketService, RestService]);
