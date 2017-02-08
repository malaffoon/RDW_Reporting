import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {PadStartPipe} from "./shared/pad-start.pipe";
import {AppComponent} from "./app.component";
import {AssessmentComponent} from "./assessment/assessment.component";
import {DataService} from "./shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {environment} from "../environments/environment";
import {standaloneProviders} from "./standalone/standalone.service";
import {StudentsComponent} from "./students/students.component";
import {GroupsComponent} from "./groups/groups.component";
import { AssessmentsComponent } from './assessments/assessments.component';

let routes = [
  {
    path: '',
    redirectTo: '/groups',
    pathMatch: 'full'
  },
  {
    path: 'groups',
    component: GroupsComponent
  },
  {
    path: 'groups/:groupId/students',
    component: StudentsComponent
  },
  {
    path: 'groups/:groupId/students/:studentId/assessments',
    component: AssessmentsComponent
  },
  {
    path: 'groups/:groupId/assessments', // aggregate
    component: AssessmentsComponent
  },
  {
    path: 'assessments/:assessmentId',
    component: AssessmentComponent
  }
];

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/translations', '');
}

@NgModule({
  declarations: [
    PadStartPipe,
    AppComponent,
    AssessmentComponent,
    StudentsComponent,
    GroupsComponent,
    AssessmentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  providers: [
    DataService,
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
