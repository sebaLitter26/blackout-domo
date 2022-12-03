import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StationConfigDialogComponent } from './station-config-dialog.component';

describe('StationConfigDialogComponent', () => {
  let component: StationConfigDialogComponent;
  let fixture: ComponentFixture<StationConfigDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
