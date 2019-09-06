import {
  AfterViewInit,
  Component,
  EventEmitter,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AggregateReportOptions } from '../aggregate-report-options';
import { AggregateReportFormOptions } from '../aggregate-report-form-options';
import { AggregateReportOptionsMapper } from '../aggregate-report-options.mapper';
import { ScrollNavItem } from '../../shared/nav/scroll-nav.component';
import { BaseAggregateQueryFormComponent } from './base-aggregate-query-form.component';

const CommonNavigationItems: ScrollNavItem[] = [
  {
    id: 'reportTypeSection',
    translationKey: 'aggregate-report-form.section.report-type-heading'
  }
];

@Component({
  selector: 'aggregate-query-form-container',
  templateUrl: './aggregate-query-form-container.component.html'
})
export class AggregateQueryFormContainerComponent implements AfterViewInit {
  @ViewChildren('reportForm')
  reportForms: QueryList<BaseAggregateQueryFormComponent>;

  accessDenied: boolean;
  aggregateReportOptions: AggregateReportOptions;
  queryType: string;
  queryTypes: string[];
  filteredOptions: AggregateReportFormOptions;
  navItems: ScrollNavItem[];
  formByReportType: {
    [reportType: string]: BaseAggregateQueryFormComponent;
  } = {};

  constructor(
    private optionMapper: AggregateReportOptionsMapper,
    private route: ActivatedRoute
  ) {
    const { options, query } = route.snapshot.data;
    this.aggregateReportOptions = options;
    this.queryType = query != null ? query.type : 'CustomAggregate';
    this.queryTypes = options.reportTypes.slice();
    this.filteredOptions = optionMapper.map(this.aggregateReportOptions);
    this.accessDenied =
      this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  ngAfterViewInit(): void {
    this.formByReportType = this.reportForms.toArray().reduce((map, form) => {
      map[form.getReportType()] = form;
      return map;
    }, {});
    setTimeout(() => {
      this.navItems = CommonNavigationItems.concat(
        this.formByReportType[this.queryType].getNavItems()
      );
    });
  }

  onReportTypeChange(): void {
    const form = this.formByReportType[this.queryType];
    this.navItems = CommonNavigationItems.concat(form.getNavItems());
    form.updateSubjectsEnabled();
  }

  onGenerateButtonClick(): void {
    this.formByReportType[this.queryType].onGenerateButtonClick();
  }
}
