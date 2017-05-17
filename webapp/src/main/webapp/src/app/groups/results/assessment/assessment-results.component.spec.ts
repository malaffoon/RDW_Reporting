import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentResultsComponent } from './assessment-results.component';
import { APP_BASE_HREF } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppModule } from "../../../app.module";
import { Component } from "@angular/core";

describe('AssessmentResultsComponent', () => {
  let component: AssessmentResultsComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), HttpModule, FormsModule ],
      declarations: [ TestComponentWrapper, AssessmentResultsComponent ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;

    fixture.detectChanges();

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<assessment-results [assessment]="assessment"></assessment-results>'
})
class TestComponentWrapper {
  assessment = { sessions: [] }
}
