import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { standaloneProviders } from "./standalone/standalone.service";
import { HomeComponent } from "./home/home.component";
import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { BsDropdownModule, TabsModule, ModalModule } from "ngx-bootstrap";
import { CommonModule } from "./shared/common.module";
import { GroupsModule } from "./groups/groups.module";
import { UserModule } from "./user/user.module";
import { routes } from "./app.routes";
import { RouterModule } from "@angular/router";
import { SchoolGradeModule } from "./school-grade/school-grade.module";

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    GroupsModule,
    SchoolGradeModule,
    RouterModule.forRoot(routes),
    UserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    ...(environment.standalone ? standaloneProviders : [])
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
