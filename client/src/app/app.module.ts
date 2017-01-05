import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, BaseRequestOptions, HttpModule} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {StudentsComponent} from "./students/students.component";
import {AssessmentComponent} from "./assessment/assessment.component";
import {AssessmentService} from "./shared/assessment.service";
import {StandaloneService} from "./standalone/standalone.service";
import {environment} from "../environments/environment";


let conditionalServices = [];
if (environment.standalone) {
  conditionalServices = [
    MockBackend,
    BaseRequestOptions,
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory: (backend, options) => {
        return new Http(backend, options);
      }
    },
    StandaloneService
  ];
}

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

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    AssessmentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AssessmentService, ...conditionalServices],
  bootstrap: [AppComponent]
})
export class AppModule {
}
