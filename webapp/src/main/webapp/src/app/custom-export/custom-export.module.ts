import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { Angulartics2Module } from "angulartics2";
import { CommonModule } from "../shared/common.module";
import { CustomExportComponent } from "./custom-export.component";
import { CustomExportLinkComponent } from "./custom-export-link.component";
import { UserModule } from "../user/user.module";

@NgModule({
  declarations: [
    CustomExportComponent,
    CustomExportLinkComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    UserModule,
    Angulartics2Module.forChild()
  ],
  exports: [
    CustomExportComponent,
    CustomExportLinkComponent
  ],
  providers: []
})
export class CustomExportModule {
}
