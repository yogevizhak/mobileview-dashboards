import { Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';
import { sbdDataTotalBox } from '../../shared/components/data-total-box/data-total-box.component';
import { sbdDataTable } from '../../shared/components/data-table/data-table.component';
import { SbdGridTable } from '../../shared/components/grid-table/grid-table.component';

@Component({
  selector: 'dynamic-component',
  entryComponents: [sbdDataTotalBox, sbdDataTable, SbdGridTable],
  template: `
    <div #dynamicComponentContainer></div>
  `,
})
export class DynamicComponent {
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;
  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) { return; }
    let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
    let factory = this.resolver.resolveComponentFactory(this.getComponentObject(data.component));
    let component = factory.create(injector);
    this.dynamicComponentContainer.insert(component.hostView);
    if (this.currentComponent) { this.currentComponent.destroy(); }
    this.currentComponent = component;
  }

  constructor(private resolver: ComponentFactoryResolver) {}

  getComponentObject(name: string): any {
    switch (name) {
      case "sbdDataTable":
        return sbdDataTable;

      case "SbdGridTable":
        return SbdGridTable;

      case "sbdDataTotalBox":
        return sbdDataTotalBox;

      default:
        return null;
    }
  }
}
