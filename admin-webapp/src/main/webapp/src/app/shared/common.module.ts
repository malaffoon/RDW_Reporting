import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Angulartics2Module } from 'angulartics2';
import {
  AuthenticationServiceAuthenticationExpiredRoute,
  RdwDataModule,
  RdwDataTableModule,
  RdwFormatModule,
  RdwI18nModule,
  RdwMenuModule,
  RdwSecurityModule,
  RdwTranslateLoader
} from "@sbac/rdw-reporting-common-ngx";
import { RdwLayoutModule } from "@sbac/rdw-reporting-common-ngx/layout";

@NgModule({
  imports: [
    Angulartics2Module.forChild(),
    BrowserModule,
    FormsModule,
    HttpModule,
    RdwDataModule.forRoot(),
    RdwDataTableModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwLayoutModule,
    RdwMenuModule,
    RdwSecurityModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: RdwTranslateLoader
      }
    })
  ],
  exports: [
    TranslateModule,
    RdwDataTableModule,
    RdwFormatModule,
    RdwI18nModule,
    RdwLayoutModule,
    RdwSecurityModule,
    RouterModule
  ],
  providers: [
    { provide: AuthenticationServiceAuthenticationExpiredRoute, useValue: 'session-expired' }
  ]
})
export class CommonModule {
}
