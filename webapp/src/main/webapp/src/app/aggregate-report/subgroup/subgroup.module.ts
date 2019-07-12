import { NgModule } from '@angular/core';
import { SubgroupMapper } from './subgroup.mapper';
import { SubgroupComponent } from './subgroup.component';
import { SubgroupFiltersComponent } from './subgroup-filters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SubgroupComponent, SubgroupFiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportingCommonModule
  ],
  exports: [SubgroupComponent, SubgroupFiltersComponent],
  providers: [SubgroupMapper]
})
export class SubgroupModule {}
