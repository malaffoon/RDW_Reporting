import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {PadStartPipe} from "./shared/pad-start.pipe";
import {AppComponent} from "./app.component";
import {ExamComponent} from "./exam/exam.component";
import {DataService} from "./shared/data.service";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {environment} from "../environments/environment";
import {standaloneProviders} from "./standalone/standalone.service";
import {StudentsComponent} from "./students/students.component";
import {GroupsComponent} from "./groups/groups.component";
import {ExamsComponent} from "./exams/exams.component";
import {routes} from "./shared/routes";
import { HomeComponent } from './home/home.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/translations', '');
}

@NgModule({
  declarations: [
    PadStartPipe,
    AppComponent,
    ExamComponent,
    StudentsComponent,
    GroupsComponent,
    ExamsComponent,
    HomeComponent
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
export class AppModule {
}
