import { NgModule } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SchoolTypeahead } from '../school/school-typeahead';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SchoolTypeahead],
  imports: [CommonModule, FormsModule, TranslateModule, TypeaheadModule],
  exports: [SchoolTypeahead]
})
export class SchoolModule {}
