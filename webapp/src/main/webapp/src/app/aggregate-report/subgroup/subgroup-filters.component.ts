import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubgroupFilterFormOptions } from './subgroup-filter-form-options';
import { Option } from '../../shared/form/option';
import { TranslateService } from '@ngx-translate/core';
import { SubgroupFilters } from '../../shared/model/subgroup-filters';

@Component({
  selector: 'subgroup-filters',
  templateUrl: './subgroup-filters.component.html'
})
export class SubgroupFiltersComponent {
  @Input()
  options: SubgroupFilterFormOptions;

  @Input()
  settings: SubgroupFilters;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  constructor(private translateService: TranslateService) {}

  onSettingChangeInternal(event): void {
    this.changed.emit(event);
  }

  optionsChanged(event) {
    const { settings } = this;
    settings.languages = event.map(({ value }) => value);
    if (settings.languages.length == 0) {
      settings.languages = this.options.languages.map(({ value }) => value);
    }
    this.changed.emit(event);
  }

  getOptions(): Option[] {
    const { settings } = this;
    if (
      settings.languages.length == 0 ||
      settings.languages.length == this.options.languages.length
    ) {
      return [];
    }
    const translate = code => this.translateService.instant(code);
    return settings.languages.map(
      lang =>
        <Option>{
          value: lang,
          text: translate(`common.languages.${lang}`),
          disabled: false
        }
    );
  }
}
