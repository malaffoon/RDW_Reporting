import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { Angulartics2Module } from "angulartics2";
import { CommonModule } from "../shared/common.module";
import { CustomExportComponent } from "./custom-export.component";
import { UserModule } from "../user/user.module";
import { OrganizationService } from "./organization/organization.service";
import { OrganizationMapper } from "./organization/organization.mapper";
import { OrganizationTreeComponent } from "./organization/organization-tree.component";

@NgModule({
  declarations: [
    CustomExportComponent,
    OrganizationTreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    UserModule,
    Angulartics2Module.forChild(),
  ],
  exports: [
    CustomExportComponent,
    OrganizationTreeComponent
  ],
  providers: [
    OrganizationService,
    OrganizationMapper
  ]
})
export class CustomExportModule {
}
