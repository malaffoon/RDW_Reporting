import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { StudentSearchFormComponent } from './student-search-form.component';
import { StudentSearchFormOptionsService } from './student-search-form-options.service';
import { StudentService } from './student.service';
import { SchoolAndGroupTypeaheadComponent } from './school-and-group-typeahead.component';
import { SchoolAndGroupTypeaheadOptionMapper } from './school-and-group-typeahead-option.mapper';
import { TypeaheadModule } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [StudentSearchFormComponent, SchoolAndGroupTypeaheadComponent],
  imports: [CommonModule, FormsModule, ReportingCommonModule, TypeaheadModule],
  exports: [StudentSearchFormComponent],
  providers: [
    StudentService,
    StudentSearchFormOptionsService,
    SchoolAndGroupTypeaheadOptionMapper
  ]
})
export class StudentSearchModule {}
