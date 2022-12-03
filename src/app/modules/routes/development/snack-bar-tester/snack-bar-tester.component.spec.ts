import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarTesterComponent } from './snack-bar-tester.component';

describe('SnackBarTesterComponent', () => {
  let component: SnackBarTesterComponent;
  let fixture: ComponentFixture<SnackBarTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarTesterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
