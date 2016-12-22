import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { sbdLayoutComponent } from './layout.component';

@Component({
    selector: 'layout-container',
    template: `
        <div class="layout-container">
       <input type="button" class="load-layout-btn" value="Load Layout" (click)="injectLayout()" />
        </div>
    `,
     styleUrls: ['./layoutContainer.style.css']
})
export class layoutContainerComponent {
    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef) {
    }

    private injectLayout() {    
        const factory = this.componentFactoryResolver.resolveComponentFactory(sbdLayoutComponent);
        const ref = this.viewContainerRef.createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}