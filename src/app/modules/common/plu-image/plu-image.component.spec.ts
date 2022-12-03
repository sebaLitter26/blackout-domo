import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluImageComponent } from './plu-image.component';

describe('PluImageComponent', () => {
  let component: PluImageComponent;
  let fixture: ComponentFixture<PluImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
