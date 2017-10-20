import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByDistractorComponent } from './by-distractor.component';

describe('ByDistractorComponent', () => {
  let component: ByDistractorComponent;
  let fixture: ComponentFixture<ByDistractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByDistractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByDistractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
