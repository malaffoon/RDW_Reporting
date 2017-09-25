import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "primeng/components/common/shared";
import { Angulartics2Module } from "angulartics2";
import { CommonModule } from "../shared/common.module";
import { CustomExportComponent } from "./custom-export.component";
import { UserModule } from "../user/user.module";

@NgModule({
  declarations: [
    CustomExportComponent
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
    CustomExportComponent
  ],
  providers: []
})
export class CustomExportModule {
}
