import { Component, Injector } from '@angular/core';

@Component({
    selector: 'sbd-data-total-box',
    templateUrl: './data-total-box.template.html',
    styleUrls: ['./data-total-box.style.css'],
})
export class sbdDataTotalBox {
    title: string;
    subtitle: string;

    constructor(private injector: Injector) {
        this.title = this.injector.get('title');
        this.subtitle = this.injector.get('subtitle');
    }
}
