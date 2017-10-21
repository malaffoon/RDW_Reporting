import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByItemComponent } from './results-by-item.component';

describe('ResultsByItemComponent', () => {
  let component: ResultsByItemComponent;
  let fixture: ComponentFixture<ResultsByItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsByItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsByItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
