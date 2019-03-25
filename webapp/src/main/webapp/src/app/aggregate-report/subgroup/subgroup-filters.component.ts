import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubgroupFilters } from './subgroup-filters';
import { SubgroupFilterFormOptions } from './subgroup-filter-form-options';
import { ApplicationSettingsService } from '../../app-settings.service';
import { Option } from '../../shared/form/option';
import { TranslateService } from '@ngx-translate/core';


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

  appSettings: {elasEnabled: boolean, lepEnabled: boolean};

  constructor(private applicationSettingsService: ApplicationSettingsService,
              private translateService: TranslateService,) {
    applicationSettingsService.getSettings().subscribe(settings => this.appSettings = settings);
  }

  onSettingChangeInternal(event): void {
    this.changed.emit(event);
  }

  optionsChanged(event) {
    let newLanguages = [];
    this.settings.languages = newLanguages.concat(event.map(lang => {
      return lang.value;
    }));
    if(this.settings.languages.length == 0) {
      this.settings.languages = this.options.languages.map( option => {
        return option.value;
      });
    }
    this.changed.emit(event);
  }

  getOptions(): Option[] {
    if((this.settings.languages.length == 0) || (this.settings.languages.length == this.options.languages.length)) {
      return [];
    }
    const translate = code => this.translateService.instant(code);
    return this.settings.languages.map( lang => <Option>{
      value: lang,
      text: translate(`common.languages.${lang}`),
      disabled: false
    });
  }

}
