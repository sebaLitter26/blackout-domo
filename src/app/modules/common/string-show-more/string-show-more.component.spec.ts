import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringShowMore } from './string-show-more.component';

describe('CustomCellComponent', () => {
  let component: StringShowMore;
  let fixture: ComponentFixture<StringShowMore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringShowMore ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringShowMore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
