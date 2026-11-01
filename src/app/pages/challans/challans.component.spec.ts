import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallansComponent } from './challans.component';

describe('ChallansComponent', () => {
  let component: ChallansComponent;
  let fixture: ComponentFixture<ChallansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallansComponent]
    });
    fixture = TestBed.createComponent(ChallansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
