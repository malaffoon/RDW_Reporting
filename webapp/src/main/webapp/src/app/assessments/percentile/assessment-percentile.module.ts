
import { NgModule } from "@angular/core";
import { AssessmentPercentileTable } from "./assessment-percentile-table.component";
import { AssessmentPercentileService } from "./assessment-percentile.service";
import { CommonModule } from "../../shared/common.module";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [
    AssessmentPercentileTable
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    AssessmentPercentileTable
  ],
  providers: [
    AssessmentPercentileService
  ]
})
export class AssessmentPercentileModule {

}
