import { NgModule } from "@angular/core";
import { CommonModule } from "../shared/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule, DropdownModule } from "primeng/primeng";
import { SchoolGradeComponent } from "./school-grade.component";
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
    ReactiveFormsModule,
    DropdownModule,
    SharedModule
  ],
  exports: [ SchoolGradeComponent ],
  providers: [ SchoolService ]
})
export class SchoolGradeModule {
}
