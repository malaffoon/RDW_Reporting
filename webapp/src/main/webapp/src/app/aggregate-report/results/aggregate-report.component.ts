import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from '../../report/report.model';
import { SupportedRowCount } from './aggregate-report-table.component';
import { AggregateReportOptions } from '../aggregate-report-options';
import { AggregateReportItemMapper } from './aggregate-report-item.mapper';
import { AssessmentDefinition } from '../assessment/assessment-definition';
import { forkJoin, interval, Subscription } from 'rxjs';
import { Utils } from '../../shared/support/support';
import { Comparator, join, ranking } from '@kourge/ordering/comparator';
import { ordering } from '@kourge/ordering';
import { AggregateReportQuery } from '../../report/aggregate-report-request';
import { DisplayOptionService } from '../../shared/display-options/display-option.service';
import { TranslateService } from '@ngx-translate/core';
import { AggregateReportRequestMapper, ServerAggregateReportType } from '../aggregate-report-request.mapper';
import { SpinnerModal } from '../../shared/loading/spinner.modal';
import { OrderableItem } from '../../shared/order-selector/order-selector.component';
import { AggregateReportColumnOrderItemProvider } from '../aggregate-report-column-order-item.provider';
import { AggregateReportRequestSummary } from '../aggregate-report-summary.component';
import { finalize, switchMap } from 'rxjs/operators';
import { LongitudinalCohortChart, OrganizationPerformance } from './longitudinal-cohort-chart';
import { AggregateReportService, LongitudinalReport } from '../aggregate-report.service';
import { LongitudinalCohortChartMapper } from './longitudinal-cohort-chart.mapper';
import { AggregateReportItem } from './aggregate-report-item';
import { organizationOrdering, subgroupOrdering } from '../support';
import { LongitudinalDisplayType } from '../../shared/display-options/longitudinal-display-type';
import { AssessmentDefinitionService } from '../assessment/assessment-definition.service';
import { AggregateReportType } from '../aggregate-report-form-settings';
import { SubjectService } from '../../subject/subject.service';
import { SubjectDefinition } from '../../subject/subject';
import { ValueDisplayTypes } from '../../shared/display-options/value-display-type';
import { PerformanceLevelDisplayTypes } from '../../shared/display-options/performance-level-display-type';
import { AggregateTargetOverview } from './aggregate-target-overview';
import { createTargetOverview } from './aggregate-target-overviews';

const PollingInterval = 4000;

interface AggregateReportTableDisplayOptions {
  readonly valueDisplayTypes: any[];
  readonly performanceLevelDisplayTypes: any[];
  readonly longitudinalDisplayTypes: any[];
}

interface AggregateReportView {

  targetOverview?: AggregateTargetOverview;

  originalRows: AggregateReportItem[];
  rows: AggregateReportItem[];
  subjectDefinition: SubjectDefinition;
  options: AggregateReportOptions;
  reportType: AggregateReportType;

  valueDisplayType: string;
  performanceLevelDisplayType: string;
  columnOrdering: string[];
  columnOrderingItems: OrderableItem[];
  chart?: LongitudinalCohortChart;
  showEmpty: boolean;
  emptyRowCount: number;
}

enum ViewState {
  ReportProcessing,
  ReportEmpty,
  ReportNotLoadable,
  ReportSizeNotSupported,
  ReportView
}

/**
 * This component is responsible for performing the aggregate report query and
 * displaying the results.  Results are displayed in one table per subjectId.
 */
@Component({
  selector: 'aggregate-report',
  templateUrl: 'aggregate-report.component.html',
})
export class AggregateReportComponent implements OnInit, OnDestroy {

  @ViewChild('spinnerModal')
  spinnerModal: SpinnerModal;

  assessmentDefinition: AssessmentDefinition;
  options: AggregateReportOptions;
  report: Report;
  reportViews: AggregateReportView[];
  showRequest: boolean = false;
  summary: AggregateReportRequestSummary;
  longitudinalDisplayType = LongitudinalDisplayType.GeneralPopulation;

  private _viewComparator: Comparator<AggregateReportView>;
  private _pollingSubscription: Subscription;
  private _displayLargeReport: boolean = false;
  private _displayOptions: AggregateReportTableDisplayOptions;
  private _viewState: ViewState;
  private _aggregateReport: any;
  private _subjectDefinitions: SubjectDefinition[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportService: AggregateReportService,
              private requestMapper: AggregateReportRequestMapper,
              private itemMapper: AggregateReportItemMapper,
              private displayOptionService: DisplayOptionService,
              private translateService: TranslateService,
              private definitionService: AssessmentDefinitionService,
              private columnOrderableItemProvider: AggregateReportColumnOrderItemProvider,
              private subjectService: SubjectService,
              private chartMapper: LongitudinalCohortChartMapper) {

    this.options = this.route.snapshot.data[ 'options' ];
    this.report = this.route.snapshot.data[ 'report' ];

    this.assessmentDefinition = this.definitionService.get(this.query.assessmentTypeCode, this.mapToReportType(this.query.reportType));
    this._viewComparator = ordering(ranking(this.options.subjects.map(subject => subject.code)))
      .on((wrapper: AggregateReportView) => wrapper.subjectDefinition.subject).compare;
    this._displayOptions = {
      valueDisplayTypes: this.displayOptionService.getValueDisplayTypeOptions(),
      performanceLevelDisplayTypes: this.displayOptionService.getPerformanceLevelDisplayTypeOptions(),
      longitudinalDisplayTypes: this.displayOptionService.getLongitudinalDisplayTypeOptions()
    };

    forkJoin(
      this.subjectService.getSubjectDefinitions(),
      this.requestMapper.toSettings(this.report.request, this.options)
    ).subscribe(([subjectDefinitions, settings]) => {
      this.summary = {
        assessmentDefinition: this.assessmentDefinition,
        options: this.options,
        settings: settings
      };

      this._subjectDefinitions = subjectDefinitions;
    });
  }

  get effectiveReportType() {
    return this.reportService.getEffectiveReportType(this.mapToReportType(this.query.reportType), this.assessmentDefinition);
  }

  get displayOptions(): AggregateReportTableDisplayOptions {
    return this._displayOptions;
  }

  get query(): AggregateReportQuery {
    return this.report.request.query;
  }

  get reportProcessing(): boolean {
    return this._viewState === ViewState.ReportProcessing;
  }

  get reportEmpty(): boolean {
    return this._viewState === ViewState.ReportEmpty;
  }

  get reportNotLoadable(): boolean {
    return this._viewState === ViewState.ReportNotLoadable;
  }

  get reportSizeNotSupported(): boolean {
    return this._viewState === ViewState.ReportSizeNotSupported;
  }

  get reportView(): boolean {
    return this._viewState === ViewState.ReportView;
  }

  ngOnInit(): void {
    this.updateViewState();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onUpdateRequestButtonClick(): void {
    this.router.navigate([ '..' ], { relativeTo: this.route, queryParams: { src: this.report.id } });
  }

  onToggleRequestViewButtonClick(): void {
    this.showRequest = !this.showRequest;
  }

  onDisplayReportButtonClick(): void {
    this._displayLargeReport = true;
    this.updateViewState();
  }

  onDownloadDataButtonClick(): void {
    this.reportService.downloadReportContent(this.report.id);
    this.router.navigateByUrl('/reports');
  }

  getExportName(view: AggregateReportView): string {
    const subjectLabel: string = this.translateService.instant(`subject.${view.subjectDefinition.subject}.name`);
    return this.translateService.instant('aggregate-report.export-name', {
      label: this.report.label,
      subject: subjectLabel
    });
  }

  onColumnOrderChange(tableView: AggregateReportView, items: OrderableItem[]): void {
    tableView.columnOrdering = items.map(item => item.value);
  }

  onShowEmptyChange(view: AggregateReportView): void {
    view.rows = view.originalRows.filter(row => view.showEmpty || row.studentsTested > 0);
  }

  isEmbargoed(): boolean {
    return this.report.metadata.createdWhileDataEmbargoed === 'true';
  }

  onLongitudinalDisplayTypeChange(): void {
    if (!this._aggregateReport) {
      return;
    }
    this.reportViews = this.createReportViews(this.query, this._aggregateReport);
  }

  mapToReportType(serverReportType: ServerAggregateReportType): AggregateReportType {
    if (serverReportType == ServerAggregateReportType.Longitudinal) {
      return AggregateReportType.LongitudinalCohort
    }
    if (serverReportType == ServerAggregateReportType.CustomAggregate) {
      return AggregateReportType.GeneralPopulation
    }
    if (serverReportType == ServerAggregateReportType.Claim) {
      return AggregateReportType.Claim;
    }
    if (serverReportType == ServerAggregateReportType.Target) {
      return AggregateReportType.Target;
    }
  }

  get isLongitudinal(): boolean {
    return this.query.reportType === ServerAggregateReportType.Longitudinal;
  }

  get showTargetMathCautionMessage(): boolean {
    return this.query.reportType == ServerAggregateReportType.Target && this.query.subjectCode == 'Math';
  }

  private updateViewState(): void {
    const targetViewState = this.getTargetViewState();
    this.onViewStateChange(this._viewState, targetViewState);
    this._viewState = targetViewState;
  }

  private getTargetViewState(): ViewState {
    if (this.report.processing) {
      return ViewState.ReportProcessing;
    }
    if (this.report.empty) {
      return ViewState.ReportEmpty;
    }
    if (!this.report.completed) {
      return ViewState.ReportNotLoadable;
    }
    if (!this.isSupportedSize(this.report) && !this._displayLargeReport) {
      return ViewState.ReportSizeNotSupported;
    }
    if (this.report.completed) {
      return ViewState.ReportView;
    }
    return ViewState.ReportProcessing;
  }

  private onViewStateChange(oldState: ViewState, newState: ViewState) {
    if (oldState === newState) {
      return;
    }

    if (oldState === ViewState.ReportProcessing) {
      this.unsubscribe();
    }
    if (newState === ViewState.ReportProcessing) {
      this.pollReport();
    }
    if (newState === ViewState.ReportView) {
      this.loadReport();
    }
  }

  private pollReport(): void {
    this._pollingSubscription = interval(PollingInterval)
      .pipe(
        switchMap(() => this.reportService.getReportById(this.report.id))
      )
      .subscribe(report => {
        this.report = report;
        this.updateViewState();
      });
  }

  private isSupportedSize(report: Report): boolean {
    const rowCount: string = this.report.metadata.totalCount;
    return Utils.isUndefined(rowCount)
      || (Number.parseInt(rowCount) <= SupportedRowCount);
  }

  private loadReport(): void {
    this.spinnerModal.loading = true;

    let observable;
    if (this.effectiveReportType === AggregateReportType.LongitudinalCohort) {
      observable = this.reportService.getLongitudinalReport(this.report.id);
    } else {
      observable = this.reportService.getAggregateReport(this.report.id);
    }

    observable.pipe(
      finalize(() => {
        this.spinnerModal.loading = false;
      })
    ).subscribe(report => {
      this._aggregateReport = report;
      this.reportViews = this.createReportViews(this.query, report);
    });

  }

  private createReportViews(query: AggregateReportQuery, report: any): AggregateReportView[] {

    const {
      options,
      effectiveReportType: reportType,
      _subjectDefinitions,
      assessmentDefinition,
      columnOrderableItemProvider,
      longitudinalDisplayType,
      itemMapper,
      reportViews,
      chartMapper,
      _viewComparator
    } = this;

    const { rows, assessments } = report;
    const hasLongitudinalData = assessments != null;

    const measuresGetter = hasLongitudinalData && longitudinalDisplayType == LongitudinalDisplayType.Cohort
      ? (row) => row.cohortMeasures : (row) => row.measures;

    const rowMapper: (query, subjectDefinition, row, index) => AggregateReportItem =
      (query, subjectDefinition, row, index) => itemMapper.createRow(query, subjectDefinition, row, index, measuresGetter);

    // Preserve existing display type choices if they exist
    const displayBySubject: Map<string, any> = (reportViews || []).reduce((map, view) => {
      map.set(view.subjectDefinition.subject, {
        valueDisplayType: view.valueDisplayType,
        performanceLevelDisplayType: view.performanceLevelDisplayType
      });
      return map;
    }, new Map());

    return rows.reduce((views, row, index) => {
      const subjectCode = row.assessment.subjectCode;

      const subjectDefinition = _subjectDefinitions
        .find(({ subject, assessmentType }) =>
          subject == subjectCode
          && assessmentType == assessmentDefinition.typeCode
        );

      const item = rowMapper(query, subjectDefinition, row, index);

      let view = views.find(({ subjectDefinition: { subject }}) => subject === subjectCode);
      if (!view) {

        const columnOrdering: string[] = Utils.isNullOrEmpty(query.columnOrder)
          ? assessmentDefinition.aggregateReportIdentityColumns.concat()
          : query.columnOrder;

        const columnOrderingItems = columnOrderableItemProvider.toOrderableItems(columnOrdering);

        const displayTypes = displayBySubject.get(subjectCode) || {
          valueDisplayType: query.valueDisplayType || ValueDisplayTypes.Percent,
          performanceLevelDisplayType: query.achievementLevelDisplayType || PerformanceLevelDisplayTypes.Separate,
        };

        const showEmpty = typeof query.showEmpty !== 'undefined'
          ? query.showEmpty : true;

        view = <any>{
          subjectDefinition,
          originalRows: [ item ],
          options,
          reportType,
          showEmpty,
          columnOrdering,
          columnOrderingItems,
          ...displayTypes,
          // support for aggregate-target-overview
          table: {
            options,
            reportType,
            assessmentDefinition
          }
        };

        if (hasLongitudinalData) {
          view.chart = chartMapper.fromReport(query, <LongitudinalReport>{
            rows: rows.filter(row => row.assessment.subjectCode === subjectCode),
            assessments: assessments.filter(assessment => assessment.subject === subjectCode)
          }, measuresGetter, subjectDefinition);

          view.chart.organizationPerformances.sort(
            join(
              organizationOrdering((path: OrganizationPerformance) => path.organization, view.chart.organizationPerformances).compare,
              subgroupOrdering((path: OrganizationPerformance) => path.subgroup, options).compare
            )
          );
        }

        views.push(view);
      } else {
        view.originalRows.push(item);
      }
      return views;
    }, [])
      .map(view => ({
        ...view,
        rows: view.originalRows.filter(row => view.showEmpty || row.studentsTested > 0),
        emptyRowCount: view.originalRows.reduce((count, row) => count + (row.studentsTested === 0 ? 1 : 0), 0),
        targetOverview: reportType === AggregateReportType.Target
          ? createTargetOverview(rows.find(row => row.subgroup.dimensionGroups[0].type === 'Overall'))
          : undefined
      }))
      .sort(_viewComparator);
  }

  private unsubscribe(): void {
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
      this._pollingSubscription = undefined;
    }
  }

}
