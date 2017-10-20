import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistractorAnalysisComponent } from './distractor-analysis.component';

describe('DistractorAnalysisComponent', () => {
  let component: DistractorAnalysisComponent;
  let fixture: ComponentFixture<DistractorAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistractorAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistractorAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
