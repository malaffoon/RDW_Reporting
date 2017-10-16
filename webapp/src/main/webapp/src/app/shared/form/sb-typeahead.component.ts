import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { TypeaheadDirective } from "ngx-bootstrap";

/**
 * TODO: parkinglot ->
 * should we always have it dropdown and just limit max results? we have that option
 * should we have the mode be dynamic
 */
@Component({
  selector: 'sb-typeahead,[sb-typeahead]',
  template: `
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
  `
})
export class SBTypeahead implements OnInit {

  @Output()
  change: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  select: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  placeholder: string = '';

  @Input()
  disabled: boolean = false;

  @Input()
  search: string;

  private _options: Option[] = [];

  private _value: any;

  ngOnInit(): void {
    this.search = this.getSearchFromValue(this.value);
  }

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (this._options !== options) {
      this._options = options ? options.concat() : [];
    }
  }

  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }

  protected get disabledInternal(): boolean {
    return this.disabled || this.options.length == 0;
  }

  protected onSelectInternal(option: Option): void {
    this.value = option.value;
    this.select.emit(option.value);
  }

  protected onChangeInternal(): void {
    this.value = undefined;
  }

  private getSearchFromValue(value: any): string {
    if (value) {
      let option = this.options.find(option => option.value === value);
      if (option) {
        return option.label;
      }
    }
    return '';
  }

}

export interface Option {
  label: string;
  value: any;
  group: string;
}
