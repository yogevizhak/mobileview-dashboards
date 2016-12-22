import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LayoutService } from '../layout/layout.service';

import { sbdLayoutComponent } from './layout.component';
import { DynamicComponent } from './dynamicComponent/dynamicComponent.component';

import { sbdDataTotalBox } from '../shared/components/data-total-box/data-total-box.component';
import { sbdDataTable } from '../shared/components/data-table/data-table.component';
import { SbdGridTable } from '../shared/components/grid-table/grid-table.component';

import { StringFilterPipe } from './../shared/pipes/filterSearch.pipe';

import { Angular2DataTableModule } from 'angular2-data-table/release/';
import 'angular2-data-table/release/datatable.css';
import 'angular2-data-table/release/material.css';


@NgModule({
    declarations: [sbdLayoutComponent, DynamicComponent, sbdDataTable, StringFilterPipe, sbdDataTotalBox, SbdGridTable],
    imports: [BrowserModule, FormsModule, Angular2DataTableModule],
    exports: [sbdLayoutComponent],
    providers: [LayoutService]
})
export class sbdLayoutModule {
    constructor() { }
}