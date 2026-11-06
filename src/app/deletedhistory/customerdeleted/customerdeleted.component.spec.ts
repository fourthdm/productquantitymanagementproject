import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerdeletedComponent } from './customerdeleted.component';

describe('CustomerdeletedComponent', () => {
  let component: CustomerdeletedComponent;
  let fixture: ComponentFixture<CustomerdeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerdeletedComponent]
    });
    fixture = TestBed.createComponent(CustomerdeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
