import { Component, Input } from "@angular/core";
import { DataTable } from "primeng/components/datatable/datatable";
import { Utils } from "../support/support";

/**
 * This component is responsible for displaying user notifications.
 */
@Component({
  selector: 'datatable-row-expander',
  template: `
    <button class="btn btn-info btn-xs btn-block text-left label-max-width" (click)="toggle()" title="{{text}}"><i class="fa" [ngClass]="{'fa-chevron-right': !expanded, 'fa-chevron-down': expanded, 'mr-xs': hasText}"></i> {{text}}</button>
  `
})
export class DataTableRowExpander {

  @Input()
  datatable: DataTable;

  @Input()
  row: any;

  @Input()
  text: string = '';

  toggle(): void {
    this.datatable.toggleRow(this.row);
  }

  get expanded(): boolean {
    return this.datatable.isRowExpanded(this.row);
  }

  get hasText(): boolean {
    return !Utils.isNullOrEmpty(this.text);
  }

}