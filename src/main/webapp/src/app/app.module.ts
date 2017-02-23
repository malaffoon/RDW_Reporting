import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {TabsModule} from "ng2-bootstrap/tabs";
import {PadStartPipe} from "./shared/pad-start.pipe";
import {AppComponent} from "./app.component";
import {ExamComponent} from "./exam/exam.component";
import {DataService} from "./shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {environment} from "../environments/environment";
import {standaloneProviders} from "./standalone/standalone.service";
import {StudentsComponent} from "./students/students.component";
import {StudentExamsComponent} from "./student-exams/student-exams.component";
import {GroupExamsComponent} from "./group-exams/group-exams.component";
import {routes} from "./shared/routes";
import {HomeComponent} from "./home/home.component";
import { StudentExamItemsComponent } from './student-exam-items/student-exam-items.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/translations', '');
}

@NgModule({
  declarations: [
    PadStartPipe,
    AppComponent,
    HomeComponent,
    StudentsComponent,
    StudentExamsComponent,
    GroupExamsComponent,
    StudentExamItemsComponent,
    BreadcrumbsComponent
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
    }),
    TabsModule.forRoot()
  ],
  providers: [
    DataService,
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
