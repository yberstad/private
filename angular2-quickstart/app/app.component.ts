import {Component} from 'angular2/core';
import {MessageService} from '../services/message.service';
import {View} from "angular2/core";

@Component({
    selector: 'my-app',
    provider: [MessageService]
})

@View({
    templateUrl: "app.component.html"
})

export class AppComponent {
    constructor (
        private _messageService: MessageService
    ) { }

    private _messages: any[] = [];
    // Called once when the component is early in its creation
    ngOnInit() {
        this._messageService.find('*').then(messages => {
            this._messages = messages;
        });
    }
}
