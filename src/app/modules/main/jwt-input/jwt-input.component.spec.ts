import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JwtInputComponent } from './jwt-input.component';

describe('JwtInputComponent', () => {
  let component: JwtInputComponent;
  let fixture: ComponentFixture<JwtInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JwtInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JwtInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
