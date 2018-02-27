import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TranslateModule } from "@ngx-translate/core";
import { EmbargoAlertComponent } from "./embargo-alert.component";
import { AggregateEmbargoService } from "./aggregate-embargo.service";
import { ReportingEmbargoService } from "./reporting-embargo.service";

@NgModule({
  declarations: [
    EmbargoAlertComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot()
  ],
  providers: [
    AggregateEmbargoService,
    ReportingEmbargoService
  ],
  exports: [
    EmbargoAlertComponent
  ]
})
export class CommonEmbargoModule {

}
