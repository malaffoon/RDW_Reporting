import { NgModule } from "@angular/core";
import { DisplayOptionService } from "./display-option.service";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [
    BrowserModule,
    TranslateModule.forRoot()
  ],
  providers: [
    DisplayOptionService
  ]
})
export class RdwDisplayOptionsModule {

}
