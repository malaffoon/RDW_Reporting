import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FilterBy } from '../../model/filter-by.model';
import { ExamFilterOptions } from '../../model/exam-filter-options.model';
import { ApplicationSettingsService } from '../../../app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { SBTypeaheadGroup } from '../../../shared/form/sb-typeahead-group';
import { Option } from '../../../shared/form/option';
import { Filter } from '../../../exam/model/filter';

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

  @ViewChild(SBTypeaheadGroup)
  private sbTypeAheadGroup: SBTypeaheadGroup;

  showTransferAccess = false;

  constructor(
    private applicationSettingsService: ApplicationSettingsService,
    private translateService: TranslateService
  ) {
    applicationSettingsService.getSettings().subscribe(settings => {
      this.showTransferAccess = settings.transferAccess;
    });
  }

  get filters(): FilterBy {
    return this.filterBy;
  }

  get options(): ExamFilterOptions {
    return this.filterOptions;
  }

  isEnabled(studentFilterType: string): boolean {
    return (
      this.filterOptions.studentFilters.find(
        ({ id }) => id === studentFilterType
      ) != null
    );
  }

  removeLanguageFilter(code: any): void {
    this.sbTypeAheadGroup.removeOption(
      this.sbTypeAheadGroup.options.find(option => option.value === code)
    );
  }

  optionsChanged(values: { value: any }[]): void {
    this.filterBy.languageCodes = values.map(({ value }) => ({
      [value]: true
    }));
  }

  onSettingChangeInternal(event: any): void {
    this.changed.emit();
  }

  public getLanguagesMap(): any[] {
    const { filterOptions: { languages = [] } = {} } = this;
    return languages.map(value => ({
      value,
      text: this.translateService.instant(`common.languages.${value}`)
    }));
  }
}
