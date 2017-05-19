import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Http, HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PadStartPipe } from "./shared/pad-start.pipe";
import { AppComponent } from "./app.component";
import { DataService } from "./shared/data.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "../environments/environment";
import { standaloneProviders } from "./standalone/standalone.service";
import { GroupStudentsComponent } from "./group-students/group-students.component";
import { StudentExamsComponent } from "./student-exams/student-exams.component";
import { GroupExamsComponent } from "./group-exams/group-exams.component";
import { routes } from "./shared/routes";
import { GroupsComponent } from "./groups/groups.component";
import { HomeComponent } from "./home/home.component";
import { StudentExamItemsComponent } from "./student-exam-items/student-exam-items.component";
import { SearchPipe } from "./search.pipe";
import { StudentExamsCategorizedComponent } from "./student-exams/student-exams-categorized.component";
import { GroupExamItemComponent } from "./group-exam-item/group-exam-item.component";
import { StudentExamReportComponent } from "./student-exam-report/student-exam-report.component";
import { IabReportComponent } from "./student-exam-report/iab-report.component";
import { AdminSearchComponent } from "./admin-search/admin-search.component";
import { GroupResolve } from "./groups/group.resolve";
import { StudentExamsResolve } from "./student-exams/student-exam.resolve";
import { StudentExamItemsResolve } from "./student-exam-items/student-exam-items.resolve";
import { GroupExamItemResolve } from "./group-exam-item/group-exam-item.resolve";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { SubjectPipe } from "./shared/subject.pipe";
import { GroupResultsComponent } from "./groups/results/group-results.component";
import { BsDropdownModule } from "ngx-bootstrap";
import { GroupsResolve } from "./groups/groups.resolve";
import { CachingDataService } from "./shared/cachingData.service";
import { AssessmentsResolve } from "./groups/results/assessments.resolve";
import { SchoolYearPipe } from "./shared/schoolYear.pipe";
import { AssessmentResultsComponent } from "./groups/results/assessment/assessment-results.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export function createTranslateLoader(http: Http) {
  // return new TranslateHttpLoader(http, '/api/translations/', '');
  // until api implementation is complete, use local .json
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    PadStartPipe,
    SubjectPipe,
    SchoolYearPipe,
    SearchPipe,
    AppComponent,
    GroupsComponent,
    GroupStudentsComponent,
    StudentExamsComponent,
    StudentExamsCategorizedComponent,
    GroupExamsComponent,
    StudentExamItemsComponent,
    GroupExamItemComponent,
    BreadcrumbsComponent,
    HomeComponent,
    StudentExamReportComponent,
    IabReportComponent,
    AdminSearchComponent,
    GroupResultsComponent,
    AssessmentResultsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    BsDropdownModule,
    SharedModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [ Http ]
      }
    }),
    TabsModule.forRoot()
  ],
  providers: [
    DataService, CachingDataService, GroupResolve, GroupsResolve, AssessmentsResolve, StudentExamsResolve, StudentExamItemsResolve, GroupExamItemResolve,
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
