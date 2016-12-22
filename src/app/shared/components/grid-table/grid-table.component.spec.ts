/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SbdGridTable } from './grid-table.component';

describe('GridTableComponent', () => {
  let component: SbdGridTable;
  let fixture: ComponentFixture<SbdGridTable>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbdGridTable ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbdGridTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
