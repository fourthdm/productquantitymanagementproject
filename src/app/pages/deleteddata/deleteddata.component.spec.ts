import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteddataComponent } from './deleteddata.component';

describe('DeleteddataComponent', () => {
  let component: DeleteddataComponent;
  let fixture: ComponentFixture<DeleteddataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteddataComponent]
    });
    fixture = TestBed.createComponent(DeleteddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
