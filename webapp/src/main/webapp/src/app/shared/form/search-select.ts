import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'search-select,[search-select]',
  template: `    
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
  `
})
export class SearchSelect {

  private static readonly DefaultDropdownThreshold: number = 25;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  @Output()
  select: EventEmitter<any> = new EventEmitter();

  @Input()
  dropdownThreshold: number = SearchSelect.DefaultDropdownThreshold;

  @Input()
  placeholder: string = '';

  @Input()
  searchPlaceholder: string = '';

  search: string;

  private _options: Option[] = [];
  private _values: any[] = [];
  private _value: any = undefined;

  get options(): Option[] {
    return this._options;
  }

  @Input()
  set options(options: Option[]) {
    if (this._options !== options) {
      this._options = options.concat();
      this._values = options.map(option => option.value);
    }
  }

  get values(): any {
    return this._values;
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

  get showDropdown() {
    return this.options && this.options.length < this.dropdownThreshold;
  }

  get disabled() {
    return !this.options || this.options.length == 0;
  }

  ngOnInit() {
    if (this.showDropdown) {
      if (this.options.length == 1) {
        this.value = this.options[ 0 ];
      }
    } else {
      if (this.value) {
        this.search = this.value.name;
      }
    }
  }

}

export class Option {
  label: string; // p-dropdown requires the text/name field to be called 'label'
  group: string;
  value: any;
}
