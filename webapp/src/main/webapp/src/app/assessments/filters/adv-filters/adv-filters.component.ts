import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterBy } from '../../model/filter-by.model';
import { ExamFilterOptions } from '../../model/exam-filter-options.model';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { TranslateService } from '@ngx-translate/core';

/*
  This component contains all of the selectable advanced filters
  for a group.
 */
@Component({
  selector: 'adv-filters',
  templateUrl: './adv-filters.component.html'
})
export class AdvFiltersComponent {

  @Input()
  filterOptions: ExamFilterOptions;

  @Input()
  filterBy: FilterBy;

  @Input()
  showStudentFilter = true;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  showTransferAccess = false;
  showElas = false;
  showLep = false;

  constructor(private applicationSettingsService: ApplicationSettingsService,
              private translateService: TranslateService,
              ) {
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showTransferAccess = settings.transferAccess;
      this.showElas = settings.elasEnabled;
      this.showLep = settings.lepEnabled;
    });

  }

  onSettingChangeInternal(): void {
    this.changed.emit();
  }

  public getLanguagesMap(): any[] {
    const translate = code => this.translateService.instant(code);
    if(this.filterOptions && this.filterOptions.languages) {
      return this.filterOptions.languages.map( val => {
        return { text: translate(`common.languages.${val}`), value: val };
      });
    } else {
      return [];
    }
  }
}
