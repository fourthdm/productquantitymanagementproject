import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmindeletedComponent } from './admindeleted.component';

describe('AdmindeletedComponent', () => {
  let component: AdmindeletedComponent;
  let fixture: ComponentFixture<AdmindeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmindeletedComponent]
    });
    fixture = TestBed.createComponent(AdmindeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
