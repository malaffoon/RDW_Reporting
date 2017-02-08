import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {PadStartPipe} from "./pad-start.pipe";
import {AppComponent} from "./app.component";
import {StudentsComponent} from "./students/students.component";
import {AssessmentComponent} from "./assessment/assessment.component";
import {AssessmentService} from "./shared/assessment.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {environment} from "../environments/environment";
import {standaloneProviders} from "./standalone/standalone.service";

let routes = [
  {
    path: '',
    redirectTo: '/students',
    pathMatch: 'full'
  },
  {
    path: 'students',
    component: StudentsComponent
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
    StudentsComponent,
    AssessmentComponent
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
  providers: [AssessmentService, ...(environment.standalone ? standaloneProviders : [])],
  bootstrap: [AppComponent]
})
export class AppModule {
}
