import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvFiltersComponent } from './adv-filters.component';
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { AppModule } from "../../../app.module";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AssessmentExam } from "../model/assessment-exam.model";
import { Component } from "@angular/core";
import { FilterBy } from "../model/filter-by.model";

describe('AdvFiltersComponent', () => {
  let component: AdvFiltersComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponentWrapper ],
      imports: [ HttpModule, FormsModule, AppModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<adv-filters [filterBy]="filterBy"></adv-filters>'
})
class TestComponentWrapper {
  filterBy : FilterBy = new FilterBy();
}

