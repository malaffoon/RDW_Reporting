import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ClaimReportQuery,
  CustomAggregateReportQuery,
  ExamReportQuery, LongitudinalReportQuery,
  PrintableReportQuery,
  ReportStatus,
  TargetReportQuery,
  UserReport
} from './report';

function toStatusColor(status: ReportStatus): string {
  if (status === 'COMPLETED') {
    return 'blue-dark';
  }
  if (status === 'PENDING' || status === 'RUNNING') {
    return 'aqua';
  }
  return 'maroon';
}

/**
 * Normalizes all query types for display in a table
 * @param report The report to transform
 * @param translate Method to translate codes
 */
function toReportView(report: UserReport, translate: (code: string) => string): ReportView {

  const {query} = report;

  let assessmentTypeCode, subjectCodes = [], schoolYears = [];

  switch (query.type) {
    case 'Student':
    case 'Group':
    case 'SchoolGrade':
      const printableQuery: PrintableReportQuery = <PrintableReportQuery>query;
      assessmentTypeCode = printableQuery.assessmentTypeCode;
      subjectCodes = [ printableQuery.subjectCode ];
      schoolYears = [ printableQuery.schoolYear ];
      break;
    case 'DistrictSchoolExport':
      const examQuery: ExamReportQuery = <ExamReportQuery>query;
      schoolYears = [ examQuery.schoolYear ];
      break;
    case 'CustomAggregate':
      const customAggregate: CustomAggregateReportQuery = <CustomAggregateReportQuery>query;
      assessmentTypeCode = customAggregate.assessmentTypeCode;
      subjectCodes = customAggregate.subjectCodes;
      schoolYears = customAggregate.schoolYears;
      break;
    case 'Longitudinal':
      const longitudinal: LongitudinalReportQuery = <LongitudinalReportQuery>query;
      assessmentTypeCode = longitudinal.assessmentTypeCode;
      subjectCodes = longitudinal.subjectCodes;
      schoolYears = [ longitudinal.toSchoolYear ];
      break;

    case 'Claim':
      const claim: ClaimReportQuery = <ClaimReportQuery>query;
      assessmentTypeCode = claim.assessmentTypeCode;
      subjectCodes = claim.subjectCodes;
      schoolYears = claim.schoolYears;
      break;
    case 'Target':
      const target: TargetReportQuery = <TargetReportQuery>query;
      assessmentTypeCode = target.assessmentTypeCode;
      subjectCodes = [ target.subjectCode ];
      schoolYears = [ target.schoolYear ];
      break;
  }

  return {
    report,
    schoolYears,
    statusColor: toStatusColor(report.status),
    translatedAssessmentType: translate(
      assessmentTypeCode
        ? `common.assessment-type.${assessmentTypeCode}.short-name`
        : 'reports.all'
    ),
    // Not ideal, we should not have empty/null subject codes for reports,
    // it should be the subjects the report was created for at the time of creation
    translatedSubjectCodes: subjectCodes.length
      ? subjectCodes.map(code => translate(`subject.${code}.name`)).join(', ')
      : translate('common.collection-selection.all'),
    translatedReportType: translate(`reports.report-type.${query.type}`)
  };
}

@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html'
})
export class ReportTableComponent {

  private _reportViews: ReportView[];

  columns: Column[] = [
    new Column({id: 'label-header', field: 'report.label'}),
    new Column({id: 'report-type-header', field: 'report.reportType', sortField: 'translatedReportType'}),
    new Column({
      id: 'assessment-type-header',
      field: 'report.assessmentTypeCode',
      sortField: 'translatedAssessmentType'
    }),
    new Column({id: 'subject-header', field: 'report.subjectCodes', sortField: 'translatedSubjectCodes'}),
    new Column({id: 'school-year-header', field: 'report.schoolYears'}),
    new Column({id: 'status-header', field: 'report.status'}),
    new Column({id: 'created-header', field: 'report.created'})
  ];

  constructor(private translateService: TranslateService) {
  }

  get reportViews(): ReportView[] {
    return this._reportViews;
  }

  @Input()
  set reports(reports: UserReport[]) {
    const translate = code => this.translateService.instant(code);
    this._reportViews = (reports || []).map(report => toReportView(report, translate));
  }

}


class Column {
  id: string;
  field: string;
  sortField: string;

  constructor({id, field, sortField = ''}) {
    this.id = id;
    this.field = field;
    this.sortField = sortField ? sortField : field;
  }
}

interface ReportView {
  report: UserReport;
  statusColor: string;
  schoolYears: number[];
  translatedAssessmentType: string;
  translatedSubjectCodes: string;
  translatedReportType: string;
}
