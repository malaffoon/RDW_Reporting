import { NgModule } from "@angular/core";
import { GroupsComponent } from "./groups.component";
import { CommonModule } from "../shared/common.module";
import { GroupFilterOptionsResolve } from "./group-filter-options.resolve";
import { GroupService } from "./groups.service";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { DataTableModule } from "primeng/components/datatable/datatable";
@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    DataTableModule,
    FormsModule
  ],
  providers: [
    GroupFilterOptionsResolve,
    GroupService
  ]
})
export class GroupsModule {
}
