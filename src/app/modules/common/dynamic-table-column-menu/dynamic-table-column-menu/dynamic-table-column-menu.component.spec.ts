import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableColumnMenuComponent } from './dynamic-table-column-menu.component';

describe('DynamicTableColumnMenuComponent', () => {
  let component: DynamicTableColumnMenuComponent;
  let fixture: ComponentFixture<DynamicTableColumnMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableColumnMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableColumnMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
