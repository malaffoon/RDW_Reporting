import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule, TypeaheadModule } from 'ngx-bootstrap';
import { SBButtonTypeahead } from './sb-button-typeahead.component';
import { SBTypeahead } from './sb-typeahead.component';
import { SBCheckboxGroup } from './sb-checkbox-group.component';
import { Angulartics2Module } from 'angulartics2';
import { TranslateModule } from '@ngx-translate/core';
import { SBButtonGroup } from './sb-button-group';
import { SBRadioGroup } from './sb-radio-group';
import { InformationButtonComponent } from './information-button.component';
import { SBTypeaheadGroup } from './sb-typeahead-group';
import { AutoCompleteModule } from 'primeng/primeng';
import { FormFieldsComponent } from './component/form-fields/form-fields.component';
import { InformationIconComponent } from './component/information-icon/information-icon.component';
import { CommonModule } from '@angular/common';
import { NestedFormGroupDirective } from './directive/nested-form-group.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    PopoverModule,
    TypeaheadModule,
    TranslateModule,
    Angulartics2Module
  ],
  declarations: [
    FormFieldsComponent,
    InformationButtonComponent,
    InformationIconComponent,
    NestedFormGroupDirective,
    SBTypeahead,
    SBButtonTypeahead,
    SBTypeaheadGroup,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup
  ],
  exports: [
    FormFieldsComponent,
    InformationButtonComponent,
    InformationIconComponent,
    NestedFormGroupDirective,
    SBTypeahead,
    SBButtonTypeahead,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup,
    SBTypeaheadGroup
  ]
})
export class RdwFormModule {}
