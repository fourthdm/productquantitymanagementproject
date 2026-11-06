import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorreceiptComponent } from './vendorreceipt.component';

describe('VendorreceiptComponent', () => {
  let component: VendorreceiptComponent;
  let fixture: ComponentFixture<VendorreceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorreceiptComponent]
    });
    fixture = TestBed.createComponent(VendorreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
