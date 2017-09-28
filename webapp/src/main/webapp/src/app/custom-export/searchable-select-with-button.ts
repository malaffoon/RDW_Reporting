import { Component, Input } from "@angular/core";
import { SearchableSelect } from "./searchable-select";

@Component({
  selector: '[searchable-select-with-button]',
  template: `
    <span class="input-group">
      <p-dropdown *ngIf="showDropdown"
                  [disabled]="disabled"
                  [(ngModel)]="value"
                  [options]="options"
                  [filter]="true"
                  filterBy="label"
                  [placeholder]="placeholder"
                  [filterPlaceholder]="searchPlaceholder"></p-dropdown>
  
      <input *ngIf="!showDropdown"
             class="form-control"
             [(ngModel)]="search"
             (ngModelChange)="onSearch($event.value)"
             [typeahead]="options"
             typeaheadOptionField="label"
             typeaheadGroupField="group"
             (typeaheadOnSelect)="onSelect($event.item)"
             [placeholder]="searchPlaceholder">
      
      <span class="input-group-btn">
        <button class="btn btn-default"
                [style.line-height]="1.48"
                (click)="onButtonClick()"
                [disabled]="buttonDisabled"><span [ngClass]="{'gray': buttonDisabled}"><i class="fa fa-plus"></i> {{buttonLabel}}</span>
        </button>
      </span>
    </span>
  `
})
export class SearchableSelectWithButton extends SearchableSelect {

  @Input()
  buttonLabel: string = '';

  get buttonDisabled(): boolean {
    return this.disabled || typeof this.value === 'undefined';
  }

  onButtonClick(): void {
    if (typeof this.value !== 'undefined') {
      this.select.emit(this.value);
      this.value = undefined;
      this.search = undefined;
    }
  }

}
