import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StudentFilterOptions } from './student-filter-options';
import { StudentFilter } from './student-filter';
import { StudentFilterFormOptions } from './student-filter-form-options';
import { StudentFilterFormOptionsMapper } from './student-filter-form-options.mapper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'student-filters',
  templateUrl: './student-filters.component.html'
})
export class StudentFiltersComponent {
  @Input()
  studentFields: string[] = [];

  @Output()
  changed: EventEmitter<StudentFilter> = new EventEmitter<StudentFilter>();

  private _options: StudentFilterOptions;
  private _formOptions: StudentFilterFormOptions;
  private _value: StudentFilter;

  constructor(
    private mapper: StudentFilterFormOptionsMapper,
    private translateService: TranslateService
  ) {}

  get value(): StudentFilter {
    return this._value;
  }

  get options(): StudentFilterOptions {
    return this._options;
  }

  @Input()
  set options(options: StudentFilterOptions) {
    this._options = options;
    this._formOptions = this.mapper.fromOptions(options);
    this._value = {};
  }

  get optionsInternal(): StudentFilterFormOptions {
    return this._formOptions;
  }

  onChange(): void {
    this.changed.emit(this._value);
  }

  optionsChanged(event) {
    this._value.languages = event.map(({ value }) => value);
  }

  public getLanguagesMap(): any[] {
    if (this._options && this._options.languages) {
      return this._options.languages.map(value => ({
        text: this.translateService.instant(`common.languages.${value}`),
        value
      }));
    }
    return [];
  }
}
