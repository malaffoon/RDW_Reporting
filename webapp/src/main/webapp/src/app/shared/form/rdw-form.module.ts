import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopoverModule, TypeaheadModule } from 'ngx-bootstrap';
import { SBButtonTypeahead } from "./sb-button-typeahead.component";
import { SBTypeahead } from "./sb-typeahead.component";
import { SBCheckboxGroup } from "./sb-checkbox-group.component";
import { Angulartics2Module } from "angulartics2";
import { TranslateModule } from "@ngx-translate/core";
import { SBButtonGroup } from './sb-button-group';
import { SBRadioGroup } from './sb-radio-group';
import { InformationButtonComponent } from './information-button.component';
import { SBTypeaheadGroup } from "./sb-typeahead-group";
import { AutoCompleteModule } from "primeng/primeng";

@NgModule({
  declarations: [
    SBTypeahead,
    SBButtonTypeahead,
    SBTypeaheadGroup,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup,
    InformationButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    PopoverModule.forRoot(),
    TypeaheadModule.forRoot(),
    TranslateModule.forRoot(),
    Angulartics2Module.forRoot(),
  ],
  exports: [
    SBTypeahead,
    SBButtonTypeahead,
    SBCheckboxGroup,
    SBButtonGroup,
    SBRadioGroup,
    SBTypeaheadGroup,
    InformationButtonComponent
  ]
})
export class RdwFormModule {
}
