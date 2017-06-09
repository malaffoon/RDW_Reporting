import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssessmentsComponent } from './select-assessments.component';
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "../../../shared/common.module";

describe('SelectAssessmentsComponent', () => {
  let component: SelectAssessmentsComponent;
  let fixture: ComponentFixture<SelectAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAssessmentsComponent ],
      imports: [ HttpModule, FormsModule, CommonModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
