import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendordeletedComponent } from './vendordeleted.component';

describe('VendordeletedComponent', () => {
  let component: VendordeletedComponent;
  let fixture: ComponentFixture<VendordeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendordeletedComponent]
    });
    fixture = TestBed.createComponent(VendordeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
