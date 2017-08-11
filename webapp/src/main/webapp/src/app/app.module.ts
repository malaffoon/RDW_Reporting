import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule } from "@angular/router";
import { PopoverModule } from "ngx-bootstrap/popover";
import { Angulartics2GoogleAnalytics, Angulartics2Module } from "angulartics2";
import { AdminModule } from "./admin/admin.module";
import { GroupsModule } from "./groups/groups.module";

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AdminModule,
    GroupsModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  providers: [
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
