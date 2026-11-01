import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesorderdeletedComponent } from './salesorderdeleted.component';

describe('SalesorderdeletedComponent', () => {
  let component: SalesorderdeletedComponent;
  let fixture: ComponentFixture<SalesorderdeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesorderdeletedComponent]
    });
    fixture = TestBed.createComponent(SalesorderdeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
