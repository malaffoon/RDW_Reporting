import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DataTableModule, SharedModule } from "primeng/primeng";
import { SchoolGradeComponent } from "./school-grade.component";
import { TypeaheadModule } from "ngx-bootstrap";
import { SchoolService } from "./school.service";

/**
 * This module contains a search component for finding assessments
 * by school and grade.
 */
@NgModule({
  declarations: [
    SchoolGradeComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DataTableModule,
    SharedModule,
    TypeaheadModule
  ],
  exports: [ SchoolGradeComponent ],
  providers: [ SchoolService ]
})
export class SchoolGradeModule {
}
