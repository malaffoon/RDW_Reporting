import { OrganizationMapper } from './organization.mapper';
import { NgModule } from '@angular/core';
import { OrganizationTypeahead } from './organization-typeahead';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OrganizationTypeahead],
  imports: [CommonModule, FormsModule, TranslateModule, TypeaheadModule],
  exports: [OrganizationTypeahead],
  providers: [OrganizationMapper]
})
export class OrganizationModule {}
