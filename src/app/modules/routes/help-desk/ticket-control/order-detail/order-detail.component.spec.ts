import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountsListComponent } from './counts-list.component';

describe('CountsListComponent', () => {
  let component: CountsListComponent;
  let fixture: ComponentFixture<CountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
