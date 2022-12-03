import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLinkedListsComponent } from './dynamic-linked-lists.component';

describe('DynamicLinkedListsComponent', () => {
  let component: DynamicLinkedListsComponent;
  let fixture: ComponentFixture<DynamicLinkedListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicLinkedListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLinkedListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
