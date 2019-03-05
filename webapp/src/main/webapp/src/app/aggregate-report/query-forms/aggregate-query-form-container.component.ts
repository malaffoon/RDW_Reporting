import { AfterViewInit, Component, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AggregateReportOptions } from '../aggregate-report-options';
import { AggregateReportFormOptions } from '../aggregate-report-form-options';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { BaseAggregateQueryFormComponent } from './base-aggregate-query-form.component';

const CommonNavigationItems: ScrollNavItem[] = [{
  id: 'reportTypeSection',
  translationKey: 'aggregate-report-form.section.report-type-heading'
}];

@Component({
  selector: 'aggregate-query-form-container',
  templateUrl: './aggregate-query-form-container.component.html'
})
export class AggregateQueryFormContainerComponent implements AfterViewInit {

  @ViewChildren('reportForm')
  reportForms: QueryList<BaseAggregateQueryFormComponent>;

  accessDenied: boolean;
  aggregateReportOptions: AggregateReportOptions;
  reportType: string;
  reportTypes: string[];
  filteredOptions: AggregateReportFormOptions;
  navItems: ScrollNavItem[];
  formByReportType: {[reportType: string]: BaseAggregateQueryFormComponent} = {};

  // TODO this necessary? doesn't appear to really do anything useful
  submitActionsByReportType: {[reportType: string]: EventEmitter<Event>} = {};

  constructor(private optionMapper: AggregateReportOptionsMapper,
              private route: ActivatedRoute) {

    const { options, settings } = route.snapshot.data;
    this.aggregateReportOptions = options;
    this.reportType = settings.reportType;
    this.reportTypes = options.reportTypes.slice();
    this.filteredOptions = optionMapper.map(this.aggregateReportOptions);
    options.reportTypes.forEach(reportType => {
      this.submitActionsByReportType[reportType] = new EventEmitter();
    });
    this.accessDenied = this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  ngAfterViewInit(): void {
    this.formByReportType = this.reportForms.toArray().reduce((map, form) => {
      map[form.getReportType()] = form;
      return map;
    }, {});
    setTimeout(() => {
      this.navItems = CommonNavigationItems.concat(
        this.formByReportType[this.reportType].getNavItems()
      );
    });
  }

  onReportTypeChange(): void {
    const form = this.formByReportType[this.reportType];
    this.navItems = CommonNavigationItems.concat(form.getNavItems());
    form.updateSubjectsEnabled();
  }

  submitQuery(event: any): void {
    this.submitActionsByReportType[this.reportType].emit(event);
  }

}
