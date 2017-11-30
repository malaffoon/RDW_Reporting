import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "../shared/common.module";
import { EmbargoService } from "./embargo.service";
import { EmbargoComponent } from "./embargo.component";
import { EmbargoSettingsResolve } from "./embargo-settings.resolve";
import { DataTableModule } from "primeng/primeng";
import { ButtonsModule } from "ngx-bootstrap";
import { Toggle } from "./toggle.component";
import { EmbargoTable } from "./embargo-table.component";

@NgModule({
  declarations: [
    EmbargoComponent,
    EmbargoTable,
    Toggle
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    DataTableModule,
    ButtonsModule.forRoot()
  ],
  exports: [
    EmbargoComponent
  ],
  providers: [
    EmbargoService,
    EmbargoSettingsResolve
  ]
})
export class EmbargoModule {
}
