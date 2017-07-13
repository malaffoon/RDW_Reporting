import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemScoresComponent } from "./item-scores.component";
import { DataTableModule } from "primeng/components/datatable/datatable";
import { StudentScoreService } from "./student-score.service";
import { Component } from "@angular/core";
import { AssessmentItem } from "../../model/assessment-item.model";
import { CommonModule } from "../../../shared/common.module";

describe('ItemScoresComponent', () => {
  let component: ItemScoresComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataTableModule, CommonModule ],
      declarations: [ TestComponentWrapper, ItemScoresComponent ],
      providers: [ StudentScoreService ]
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
  template: '<item-scores [item]="item" [exams]="exams"></item-scores>'
})
class TestComponentWrapper {
  item = new AssessmentItem();
  exams = [];
}
