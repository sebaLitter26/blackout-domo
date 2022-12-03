import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringSplitterComponent } from './string-splitter.component';

describe('StringSplitterComponent', () => {
  let component: StringSplitterComponent;
  let fixture: ComponentFixture<StringSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringSplitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
