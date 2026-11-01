import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanbysaleordernumberComponent } from './challanbysaleordernumber.component';

describe('ChallanbysaleordernumberComponent', () => {
  let component: ChallanbysaleordernumberComponent;
  let fixture: ComponentFixture<ChallanbysaleordernumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChallanbysaleordernumberComponent]
    });
    fixture = TestBed.createComponent(ChallanbysaleordernumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
