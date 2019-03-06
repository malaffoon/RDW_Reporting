import { Component, Input, TemplateRef } from '@angular/core';
import { UserReport } from './report';
import { getSchoolYears, getSubjectCodes } from './reports';

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

interface UserReportTableRow {
  report: UserReport;
  subjectCodes: string[];
  schoolYears: number[];
}

/**
 * Normalizes all query types for display in a table
 * @param report The report to transform
 */
function toUserReportTableRow(report: UserReport): UserReportTableRow {
  const { query } = report;
  return {
    report,
    subjectCodes: getSubjectCodes(query),
    schoolYears: getSchoolYears(query)
  };
}

@Component({
  selector: 'user-report-table',
  templateUrl: './user-report-table.component.html'
})
export class UserReportTableComponent {
  columns: Column[] = [
    new Column({ id: 'name', field: 'report.query.name' }),
    new Column({ id: 'type', field: 'report.query.type' }),
    new Column({
      id: 'assessmentTypes',
      field: 'report.query.assessmentTypeCode'
    }),
    new Column({ id: 'subjects', field: 'subjectCodes' }),
    new Column({ id: 'schoolYears', field: 'schoolYears' }),
    new Column({ id: 'status', field: 'report.status' }),
    new Column({ id: 'created', field: 'report.created' })
  ];
  rows: UserReportTableRow[];

  @Input()
  nameTemplate: TemplateRef<any>;

  @Input()
  set userReports(values: UserReport[]) {
    this.rows = (values || []).map(toUserReportTableRow);
  }
}
