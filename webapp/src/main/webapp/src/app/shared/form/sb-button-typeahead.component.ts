import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SBTypeahead } from "./sb-typeahead.component";
import { isUndefined } from "util";

@Component({
  selector: 'sb-button-typeahead,[sb-button-typeahead]',
  template: `
    <span class="input-group">
      <input class="form-control"
             [disabled]="disabledInternal"
             [typeahead]="options"
             [typeaheadMinLength]="0"
             typeaheadOptionField="label"
             typeaheadGroupField="group"
             (typeaheadOnSelect)="onSelectInternal($event.item)"
             (ngModelChange)="onChangeInternal()"
             [(ngModel)]="search"
             [placeholder]="placeholder">
      
      <span class="input-group-btn">
        <button type="button"
                class="btn btn-default"
                (click)="onButtonClickInternal()"
                [disabled]="buttonDisabledInternal"><span [ngClass]="{'gray': buttonDisabledInternal}"><i class="fa fa-plus"></i> {{buttonLabel}}</span>
        </button>
      </span>
    </span>
  `
})
export class SBButtonTypeahead extends SBTypeahead {

  @Output()
  buttonClick: EventEmitter<any> = new EventEmitter();

  @Input()
  buttonLabel: string = '';

  protected get buttonDisabledInternal(): boolean {
    return this.disabledInternal || isUndefined(this.value);
  }

  protected onButtonClickInternal(): void {
    if (!isUndefined(this.value)) {
      this.buttonClick.emit(this.value);
      this.search = '';
    }
  }

}
