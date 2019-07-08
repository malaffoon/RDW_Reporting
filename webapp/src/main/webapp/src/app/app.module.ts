import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  AlertModule,
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PopoverModule,
  TabsModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { ReportingCommonModule } from './shared/reporting-common.module';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { Angulartics2Module } from 'angulartics2';
import { RdwRouteReuseStrategy } from './shared/rdw-route-reuse.strategy';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { HttpModule } from '@angular/http';
import { SandboxLoginModule } from './sandbox/sandbox-login.module';
import { ApplicationSecuritySettingService } from './app-security-setting.service';
import { SecuritySettingService } from './shared/security/service/security-settings.service';
import { InlineSVGModule } from 'ng-inline-svg';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { translateModuleConfiguration } from './shared/translate-module-configuration';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    CommonModule,
    HttpModule,
    ReportingCommonModule,
    // TODO lazy load
    DashboardModule,
    HomeModule,
    SandboxLoginModule,
    // ngx-bootstrap
    AlertModule.forRoot(),
    Angulartics2Module.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    InlineSVGModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    TranslateModule.forRoot(translateModuleConfiguration),
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy },
    {
      provide: SecuritySettingService,
      useClass: ApplicationSecuritySettingService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
