import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AggregateEmbargoService } from './aggregate-embargo.service';
import { ReportingEmbargoService } from './reporting-embargo.service';
import { AggregateEmbargoAlert } from './aggregate-embargo-alert.component';
import { ReportingEmbargoAlert } from './reporting-embargo-alert.component';

@NgModule({
  declarations: [AggregateEmbargoAlert, ReportingEmbargoAlert],
  imports: [BrowserModule, TranslateModule.forRoot()],
  providers: [AggregateEmbargoService, ReportingEmbargoService],
  exports: [AggregateEmbargoAlert, ReportingEmbargoAlert]
})
export class CommonEmbargoModule {}
