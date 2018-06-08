import { Component, Input } from '@angular/core';
import { Report } from './report.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html'
})
export class ReportTableComponent {

  @Input()
  subjects: string[];

  private _reportViews: ReportView[];

  columns: Column[] = [
    new Column({ id: 'label-header', field: 'report.label' }),
    new Column({ id: 'report-type-header', field: 'report.reportType', sortField: 'translatedReportType' }),
    new Column({
      id: 'assessment-type-header',
      field: 'report.assessmentTypeCode',
      sortField: 'translatedAssessmentType'
    }),
    new Column({ id: 'subject-header', field: 'report.subjectCodes', sortField: 'translatedSubjectCodes' }),
    new Column({ id: 'school-year-header', field: 'report.schoolYears' }),
    new Column({ id: 'status-header', field: 'report.status' }),
    new Column({ id: 'created-header', field: 'report.created' })
  ];

  constructor(private translateService: TranslateService) {
  }

  get reportViews(): ReportView[] {
    return this._reportViews;
  }

  @Input()
  set reports(reports: Report[]) {
    const translate = code => this.translateService.instant(code);
    this._reportViews = (reports || []).map(report => <ReportView>{
      report: report,
      translatedAssessmentType: translate(report.assessmentTypeCode
        ? `common.assessment-type.${report.assessmentTypeCode}.short-name`
        : 'reports.all'
      ),
      // Not ideal, we should not have empty/null subject codes for reports,
      // it should be the subjects the report was created for at the time of creation
      translatedSubjectCodes: report.subjectCodes.length
        ? report.subjectCodes.map(code => translate(`common.subject.${code}.name`)).join(', ')
        : translate('common.subject.ALL.name'),
      translatedReportType: translate(`reports.report-type.${report.reportType}`)
    });
  }

}


class Column {
  id: string;
  field: string;
  sortField: string;

  constructor({ id, field, sortField = '' }) {
    this.id = id;
    this.field = field;
    this.sortField = sortField ? sortField : field;
  }
}

interface ReportView {
  report: Report;
  translatedAssessmentType: string;
  translatedSubjectCodes: string;
  translatedReportType: string;
}
