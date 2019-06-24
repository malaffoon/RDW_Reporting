import { BrowserModule } from '@angular/platform-browser';
import { ANALYZE_FOR_ENTRY_COMPONENTS, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {
  AlertModule,
  BsDropdownModule,
  PopoverModule,
  TabsModule
} from 'ngx-bootstrap';
import { CommonModule } from './shared/common.module';
import { routes } from './app.routes';
import { RouteReuseStrategy, RouterModule, ROUTES } from '@angular/router';
import { TranslateResolve } from './translate.resolve';
import { Angulartics2Module } from 'angulartics2';
import { RdwRouteReuseStrategy } from './shared/rdw-route-reuse.strategy';
import { OrganizationExportModule } from './organization-export/organization-export.module';
import { AggregateReportsModule } from './aggregate-report/aggregate-reports.module';
import { AdminModule } from './admin/admin.module';
import { ApplicationSettingsService } from './app-settings.service';
import { ApplicationSettingsResolve } from './app-settings.resolve';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { HttpModule } from '@angular/http';
import { SandboxLoginModule } from './sandbox/sandbox-login.module';
import { ApplicationSecuritySettingService } from './app-security-setting.service';
import { SecuritySettingService } from './shared/security/service/security-settings.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AdminModule,
    AggregateReportsModule,
    AlertModule.forRoot(),
    BrowserModule,
    CommonModule,
    DashboardModule,
    HomeModule,
    HttpModule,
    OrganizationExportModule,
    RouterModule.forRoot([]),
    FormsModule,
    SandboxLoginModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    Angulartics2Module.forRoot()
  ],
  providers: [
    ApplicationSettingsService,
    ApplicationSettingsResolve,
    TranslateResolve,
    { provide: RouteReuseStrategy, useClass: RdwRouteReuseStrategy },
    {
      provide: ROUTES,
      multi: true,
      useValue: routes
    },
    {
      provide: ANALYZE_FOR_ENTRY_COMPONENTS,
      multi: true,
      useValue: routes
    },
    {
      provide: SecuritySettingService,
      useClass: ApplicationSecuritySettingService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
