import { Component, Input } from "@angular/core";
import { DataTable } from "primeng/components/datatable/datatable";

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'datatable-row-expander',
  templateUrl: 'datatable-row-expander.component.html'
})
export class DataTableRowExpanderComponent {

  @Input()
  datatable: DataTable;

  @Input()
  row: any;

  @Input()
  text: string = '';

  toggle(): void {
    this.datatable.toggleRow(this.row);
  }

  isExpanded(): boolean {
    return this.datatable.isRowExpanded(this.row);
  }

  hasText(): boolean {
    return this.text !== null && this.text.length !== 0;
  }

}
