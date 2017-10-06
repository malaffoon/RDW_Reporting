import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SelectItem } from 'primeng/primeng'

@Component({
  selector: 'search-select,[search-select]',
  template: `
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
           (typeaheadOnSelect)="onSelect($event.value)"
           [placeholder]="searchPlaceholder">
  `
})
export class SearchSelect {

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  @Input()
  dropdown: boolean = false;

  @Input()
  placeholder: string = '';

  @Input()
  searchPlaceholder: string = '';

  search: string;

  private _options: Option[] = [];
  private _value: any = undefined;
  private _disabled: boolean = false;

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (this._options !== options) {
      this._options = options ? options.concat() : [];
      this.updateValue();
    }
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }

  onSearch(value: string): void {
    this.value = undefined;
  }

  onSelect(option: Option): void {
    this.value = option.value;
  }

  get disabled() {
    return this._disabled || this.options.length == 0;
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }

  ngOnInit() {
    this.updateValue();

    // initialize the text if the value is already set
    if (!this.dropdown && this.value) {
      this.search = this.value.name;
    }
  }

  private updateValue() {
    // auto select the first option if it is the only option
    if (this.dropdown && this.options.length == 1) {
      this.value = this.options[ 0 ].value;
    }
  }

}

export interface Option extends SelectItem {
  group: string;
}
