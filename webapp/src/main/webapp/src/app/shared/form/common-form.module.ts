import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/primeng";
import { TypeaheadModule } from "ngx-bootstrap";
import { SearchSelectWithButton } from "./search-select-with-button";
import { SearchSelect } from "./search-select";

@NgModule({
  declarations: [
    SearchSelect,
    SearchSelectWithButton
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TypeaheadModule
  ],
  exports: [
    SearchSelect,
    SearchSelectWithButton
  ]
})
export class CommonFormModule {
}
