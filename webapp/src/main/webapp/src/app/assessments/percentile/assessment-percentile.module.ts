
import { NgModule } from "@angular/core";
import { AssessmentPercentileTable } from "./assessment-percentile-table.component";
import { AssessmentPercentileService } from "./assessment-percentile.service";
import { CommonModule } from "../../shared/common.module";
import { TableModule } from "primeng/table";
import { AssessmentPercentileButton } from "./assessment-percentile-button.component";
import { PopoverModule } from "ngx-bootstrap";
import { BrowserModule } from "@angular/platform-browser";
import { AssessmentPercentileRequestMapper } from "./assessment-percentile-request.mapper";

@NgModule({
  declarations: [
    AssessmentPercentileButton,
    AssessmentPercentileTable
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PopoverModule,
    TableModule
  ],
  exports: [
    AssessmentPercentileButton
  ],
  providers: [
    AssessmentPercentileService,
    AssessmentPercentileRequestMapper
  ]
})
export class AssessmentPercentileModule {

}
