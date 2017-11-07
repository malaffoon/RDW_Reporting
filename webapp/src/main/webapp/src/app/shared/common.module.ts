import { NgModule } from "@angular/core";
import { SubjectPipe } from "./subject.pipe";
import { HttpModule } from "@angular/http";
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
import { AlertModule, PopoverModule } from "ngx-bootstrap";
import { SessionExpiredComponent } from "./authentication/session-expired.component";
import { DatePipe, DecimalPipe } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
import { AuthenticatedHttpService } from "./authentication/authenticated-http.service";
import { SBToggleComponent } from "./sb-toggle.component";
import { InformationLabelComponent } from "./information-label.component";
import { RdwCoreModule, RdwDataModule, RdwDataTableModule, RdwFormatModule, RdwFormModule } from "@sbac/rdw-reporting-common-ngx";

@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    NotificationComponent,
    RemoveCommaPipe,
    SessionExpiredComponent,
    SubjectPipe,
    LoaderComponent,
    InformationLabelComponent,
    SBRadioButtonComponent,
    SBCheckboxList,
    SBToggleComponent
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
    }),
    PopoverModule.forRoot(),
    RdwCoreModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule
  ],
  exports: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    NotificationComponent,
    RemoveCommaPipe,
    RouterModule,
    SessionExpiredComponent,
    SubjectPipe,
    TranslateModule,
    LoaderComponent,
    InformationLabelComponent,
    SBRadioButtonComponent,
    SBCheckboxList,
    SBToggleComponent,
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule
  ],
  providers: [
    AuthenticatedHttpService,
    AuthenticationService,
    DatePipe,
    ColorService,
    DecimalPipe,
    NotificationService,
    RdwTranslateLoader
  ]
})
export class CommonModule {
}
