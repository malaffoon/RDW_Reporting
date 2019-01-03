import { Component, EventEmitter, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AggregateReportOptions } from "../aggregate-report-options";
import { AggregateReportFormSettings, AggregateReportType } from "../aggregate-report-form-settings";
import { AggregateReportFormOptions } from "../aggregate-report-form-options";
import { AggregateReportOptionsMapper } from "../aggregate-report-options.mapper";
import { ScrollNavItem } from "../../shared/nav/scroll-nav.component";
import {TargetReportFormComponent} from "./target-report-form.component";
import {ClaimReportFormComponent} from "./claim-report-form.component";
import {GeneralPopulationFormComponent} from "./general-population-form.component";
import {LongitudinalCohortFormComponent} from "./longitudinal-cohort-form.component";

@Component({
  selector: 'aggregate-query-form-container',
  templateUrl: './aggregate-query-form-container.component.html'
})
export class AggregateQueryFormContainerComponent {

  accessDenied: boolean;
  aggregateReportOptions: AggregateReportOptions;
  reportType: AggregateReportType;
  filteredOptions: AggregateReportFormOptions;

  @ViewChild('targetForm')
  targetForm: TargetReportFormComponent;
  @ViewChild('claimForm')
  claimForm: ClaimReportFormComponent;
  @ViewChild('generalPopulationForm')
  generalPopulationForm: GeneralPopulationFormComponent;
  @ViewChild('targetForm')
  longitudinalCohortForm: LongitudinalCohortFormComponent;

  navItems: ScrollNavItem[];
  navItemsByReportType: {[key: string]: ScrollNavItem[]} = {};
  submitActionsByReportType: {[key: string]: EventEmitter<Event>} = {};

  private _globalNavItems: ScrollNavItem[] = [{
    id: 'reportTypeSection',
    translationKey: 'aggregate-report-form.section.report-type-heading'
  }];

  constructor(private optionMapper: AggregateReportOptionsMapper,
              private route: ActivatedRoute) {
    this.aggregateReportOptions = route.snapshot.data[ 'options' ];
    const settings: AggregateReportFormSettings = route.snapshot.data[ 'settings' ];
    this.reportType = settings.reportType;

    const options: AggregateReportFormOptions = optionMapper.map(this.aggregateReportOptions);
    this.filteredOptions = Object.assign({}, options);
    this.filteredOptions.reportTypes.forEach((reportType) => {
      this.submitActionsByReportType[reportType.value] = new EventEmitter();
      this.navItemsByReportType[reportType.value] = this._globalNavItems;
    });

    this.accessDenied = this.aggregateReportOptions.assessmentTypes.length === 0;
  }

  setNavItems(reportType: AggregateReportType, navItems: ScrollNavItem[]): void {
    navItems = this._globalNavItems.concat(navItems);
    this.navItemsByReportType[reportType] = navItems;
    if (this.reportType === reportType) {
      this.navItems = navItems;
    }
  }

  onReportTypeChange(): void {
    this.navItems = this.navItemsByReportType[this.reportType];

    switch (this.reportType) {
      case 'GeneralPopulation':
        this.generalPopulationForm.updateSubjectsEnabled();
        break;
      case 'Claim':
        this.claimForm.updateSubjectsEnabled();
        break;
      case 'LongitudinalCohort':
        this.longitudinalCohortForm.updateSubjectsEnabled();
        break;
      case 'Target':
        this.targetForm.updateSubjectsEnabled();
        break;
      default:
        console.error('Unknown report type');
    }
  }

  submitQuery($event): void {
    this.submitActionsByReportType[this.reportType].emit($event);
  }

  get hasGeneralPopulationReport(): boolean {
    return this.hasReportType(AggregateReportType.GeneralPopulation)
  }

  get hasLongitudinalReport(): boolean {
    return this.hasReportType(AggregateReportType.LongitudinalCohort)
  }

  get hasClaimReport(): boolean {
    return this.hasReportType(AggregateReportType.Claim)
  }

  get hasTargetReport(): boolean {
    return this.hasReportType(AggregateReportType.Target)
  }

  private hasReportType(type: AggregateReportType): boolean {
    return this.filteredOptions.reportTypes.some(x => x.value == type);
  }

}
