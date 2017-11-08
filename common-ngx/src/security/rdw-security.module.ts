import { BrowserModule } from "@angular/platform-browser";
import { RdwCoreModule } from "../core/rdw-core.module";
import { NgModule } from "@angular/core";
import { AuthenticationService } from "./authentication.service";
import { Http } from "@angular/http";
import { AuthenticatedHttpService } from "./authenticated-http.service";

@NgModule({
  imports: [
    BrowserModule,
    RdwCoreModule
  ],
  providers: [
    { provide: Http, useClass: AuthenticatedHttpService },
    AuthenticationService
  ]
})
export class RdwSecurityModule {
}
