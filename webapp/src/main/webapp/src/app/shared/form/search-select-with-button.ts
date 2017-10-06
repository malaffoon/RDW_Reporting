import { Component, Input } from "@angular/core";
import { SearchSelect } from "./search-select";
import { isUndefined } from "util";

@Component({
  selector: 'search-select-with-button,[search-select-with-button]',
  template: `
    <span class="input-group">
      <p-dropdown *ngIf="dropdown"
                  [disabled]="disabled"
                  [(ngModel)]="value"
                  [options]="options"
                  [filter]="true"
                  filterBy="label"
                  [placeholder]="placeholder"
                  [filterPlaceholder]="searchPlaceholder"></p-dropdown>
  
      <input *ngIf="!dropdown" 
             class="form-control"
             [disabled]="disabled"
             [(ngModel)]="search"
             (ngModelChange)="onSearch($event.value)"
             [typeahead]="options"
             typeaheadOptionField="label"
             typeaheadGroupField="group"
             (typeaheadOnSelect)="onSelect($event.item)"
             [placeholder]="searchPlaceholder">
      
      <span class="input-group-btn">
        <button class="btn btn-default"
                (click)="onButtonClick()"
                [disabled]="buttonDisabled"><span [ngClass]="{'gray': buttonDisabled}"><i class="fa fa-plus"></i> {{buttonLabel}}</span>
        </button>
      </span>
    </span>
  `
})
export class SearchSelectWithButton extends SearchSelect {

  @Input()
  buttonLabel: string = '';

  get buttonDisabled(): boolean {
    return this.disabled || isUndefined(this.value);
  }

  onButtonClick(): void {
    if (!isUndefined(this.value)) {
      this.select.emit(this.value);
      this.value = undefined;
      this.search = undefined;
    }
  }

}
