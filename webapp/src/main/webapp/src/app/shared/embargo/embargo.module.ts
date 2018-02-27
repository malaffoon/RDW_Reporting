import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { EmbargoAlertService } from "./embargo-alert.service";
import { TranslateModule } from "@ngx-translate/core";
import { EmbargoAlertComponent } from "./embargo-alert.component";

@NgModule({
  declarations: [
    EmbargoAlertComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot()
  ],
  providers: [
    EmbargoAlertService
  ],
  exports: [
    EmbargoAlertComponent
  ]
})
export class CommonEmbargoModule {

}
