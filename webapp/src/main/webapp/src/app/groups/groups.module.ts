import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { GroupsComponent } from "./groups.component";
import { AssessmentService } from "./results/assessment/assessment.service";
import { AssessmentsResolve } from "./results/assessments.resolve";
import { GroupsResolve } from "./groups.resolve";
import { GroupResolve } from "./group.resolve";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { GroupResultsComponent } from "./results/group-results.component";
import { AssessmentResultsComponent } from "./results/assessment/assessment-results.component";
import { AssessmentExamMapper } from "./results/assessment/assessment-exam.mapper";
import { ExamStatisticsCalculator } from "./results/assessment/exam-statistics-calculator";
import { AdvFiltersComponent } from "./results/adv-filters/adv-filters.component";
import { ExamFilterService } from "./results/exam-filters/exam-filter.service";
import { ExamFilterOptionsService } from "./results/exam-filters/exam-filter-options.service";
import { ExamFilterOptionsMapper } from "./results/exam-filters/exam-filter-options.mapper";
import { SelectAssessmentsComponent } from './results/select-assessments/select-assessments.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupResultsComponent,
    AssessmentResultsComponent,
    AdvFiltersComponent,
    SelectAssessmentsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    SharedModule
  ],
  exports: [ GroupsComponent ],
  providers: [
    GroupResolve,
    GroupsResolve,
    AssessmentsResolve,
    AssessmentService,
    AssessmentExamMapper,
    ExamStatisticsCalculator,
    ExamFilterService,
    ExamFilterOptionsService,
    ExamFilterOptionsMapper
  ]
})
export class GroupsModule {
}
