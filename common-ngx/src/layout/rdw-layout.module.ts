import { NgModule } from "@angular/core";
import { Breadcrumbs } from "./breadcrumbs.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "./footer.component";
import { NavigationBarComponent } from "./navigation-bar.component";
import { RdwI18nModule } from "../i18n/rdw-i18n.module";
import { HeaderComponent } from "./header.component";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap";

@NgModule({
  declarations: [
    Breadcrumbs,
    NavigationBarComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RdwI18nModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot(),
    BsDropdownModule
  ],
  exports: [
    Breadcrumbs,
    NavigationBarComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class RdwLayoutModule {
}
