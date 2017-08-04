import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { PopoverModule } from "ngx-bootstrap/popover";
import { Angulartics2Module } from "angulartics2";
import { AdminComponent } from "./admin.component";
import { StudentGroupService } from "./student-group.service";
import { FileUploadModule } from "ng2-file-upload";

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    PopoverModule,
    FileUploadModule,
    Angulartics2Module.forChild()
  ],
  exports: [ AdminComponent ],
  providers: [ StudentGroupService ]
})

export class AdminModule {
}
