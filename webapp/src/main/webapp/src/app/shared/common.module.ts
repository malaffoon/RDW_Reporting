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
import { NotificationComponent } from "./notification/notification.component";
import { NotificationService } from "./notification/notification.service";
import { AlertModule, PopoverModule } from "ngx-bootstrap";
import { SessionExpiredComponent } from "./authentication/session-expired.component";
import { DatePipe, DecimalPipe } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
// import { AuthenticatedHttpService } from "./authentication/authenticated-http.service";
import { SBToggleComponent } from "./sb-toggle.component";
import { InformationLabelComponent } from "./information-label.component";
import {
  RdwCoreModule,
  RdwDataModule,
  RdwDataTableModule,
  RdwFormatModule,
  RdwFormModule,
  RdwSecurityModule,
  AuthenticationServiceAuthenticationExpiredRoute,
  AuthenticationServiceDefaultAuthenticationRoute
} from "@sbac/rdw-reporting-common-ngx";

@NgModule({
  declarations: [
    AssessmentTypePipe,
    GradeDisplayPipe,
    InformationLabelComponent,
    LoaderComponent,
    NotificationComponent,
    RemoveCommaPipe,
    SessionExpiredComponent,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    SubjectPipe
  ],
  imports: [
    AlertModule,
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    PopoverModule.forRoot(),
    RdwCoreModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule,
    RdwSecurityModule,
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
    InformationLabelComponent,
    LoaderComponent,
    NotificationComponent,
    RemoveCommaPipe,
    RouterModule,
    SessionExpiredComponent,
    SubjectPipe,
    RdwDataTableModule,
    RdwFormModule,
    RdwFormatModule,
    RdwSecurityModule,
    SBCheckboxList,
    SBRadioButtonComponent,
    SBToggleComponent,
    TranslateModule
  ],
  providers: [
    // AuthenticatedHttpService,
    { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' },
    { provide: AuthenticationServiceDefaultAuthenticationRoute, useValue: '/home' },
    ColorService,
    DatePipe,
    DecimalPipe,
    NotificationService,
    RdwTranslateLoader
  ]
})
export class CommonModule {
}
