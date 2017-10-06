import { Component, EventEmitter, Input, Output } from "@angular/core";

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
             (typeaheadOnSelect)="onSelect($event.item)"
             [placeholder]="searchPlaceholder">
  `
})
export class SearchSelect {

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  @Output()
  select: EventEmitter<any> = new EventEmitter();

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
    if (!this.dropdown && this.value) {
      this.search = this.value.name;
    }
  }

  private updateValue() {
    if (this.dropdown && this.options.length == 1) {
      this.value = this.options[ 0 ].value;
    }
  }

}

export class Option {
  label: string; // p-dropdown requires the text/name field to be called 'label'
  group: string;
  value: any;
}
