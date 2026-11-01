import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InletchallandeletedComponent } from './inletchallandeleted.component';

describe('InletchallandeletedComponent', () => {
  let component: InletchallandeletedComponent;
  let fixture: ComponentFixture<InletchallandeletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InletchallandeletedComponent]
    });
    fixture = TestBed.createComponent(InletchallandeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
