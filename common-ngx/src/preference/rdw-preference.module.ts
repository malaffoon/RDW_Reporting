import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { UserPreferenceService } from "./user-preference.service";
import { FormsModule } from "@angular/forms";
import { RdwCoreModule } from "../core/rdw-core.module";
import { CookieService } from "angular2-cookie/services/cookies.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RdwCoreModule
  ],
  providers: [
    CookieService,
    UserPreferenceService
  ]
})
export class RdwPreferenceModule {
}
