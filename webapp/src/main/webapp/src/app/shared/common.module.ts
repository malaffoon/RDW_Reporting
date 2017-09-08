import { NgModule } from "@angular/core";
import { PadStartPipe } from "./pad-start.pipe";
import { SubjectPipe } from "./subject.pipe";
import { SchoolYearPipe } from "./schoolYear.pipe";
import { SearchPipe } from "../search.pipe";
import { HttpModule } from "@angular/http";
import { DataService } from "./data/data.service";
import { CachingDataService } from "./cachingData.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { RemoveCommaPipe } from "./remove-comma.pipe";
import { SBRadioButtonComponent } from "./sb-radio-button-list.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SBCheckboxList } from "./sb-checkbox-list.component";
import { GradeDisplayPipe } from "./grade-display.pipe";
import { RdwTranslateLoader } from "./rdw-translate-loader";
import { AssessmentTypePipe } from "./assessment-type.pipe";
import { ColorService } from "./color.service";
import { Angulartics2Module } from "angulartics2";
import { AuthenticationService } from "./authentication/authentication.service";
import { NotificationComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/notification.service";
import { AlertModule } from "ngx-bootstrap";
import { SessionExpiredComponent } from "./authentication/session-expired.component";
import { StorageService } from "./storage.service";
import { DatePipe, DecimalPipe } from "@angular/common";
import { ScaleScoreService } from "./scale-score.service";
import { LoaderComponent } from "./loader/loader.component";
import { WindowRefService } from "./window-ref.service";
import { AuthenticatedHttpService } from "./authentication/authenticated-http.service";

@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    NotificationComponent,
    PadStartPipe,
    RemoveCommaPipe,
    SBRadioButtonComponent,
    SBCheckboxList,
    SchoolYearPipe,
    SearchPipe,
    SessionExpiredComponent,
    SubjectPipe,
    LoaderComponent
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RdwTranslateLoader
      }
    })
  ],
  exports: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    NotificationComponent,
    PadStartPipe,
    RemoveCommaPipe,
    RouterModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SchoolYearPipe,
    SearchPipe,
    SessionExpiredComponent,
    SubjectPipe,
    TranslateModule,
    LoaderComponent
  ],
  providers: [
    AuthenticatedHttpService,
    AuthenticationService,
    DataService,
    DatePipe,
    CachingDataService,
    ColorService,
    DecimalPipe,
    ScaleScoreService,
    NotificationService,
    RdwTranslateLoader,
    StorageService,
    WindowRefService
  ]
})
export class CommonModule {
}
