import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorchallandeletedComponent } from './vendorchallandeleted.component';

describe('VendorchallandeletedComponent', () => {
  let component: VendorchallandeletedComponent;
  let fixture: ComponentFixture<VendorchallandeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorchallandeletedComponent]
    });
    fixture = TestBed.createComponent(VendorchallandeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
