import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TableRowExpander } from './table-row-expander.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TableRowExpander],
  imports: [CommonModule, FormsModule, TableModule],
  exports: [TableRowExpander]
})
export class RdwDataTableModule {}
