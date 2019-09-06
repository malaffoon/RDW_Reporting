import { Component, Input, TemplateRef } from '@angular/core';
import { UserQuery } from './report';
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

interface UserQueryTableRow {
  userQuery: UserQuery;
  subjectCodes: string[];
  schoolYears: number[];
}

/**
 * Normalizes all query types for display in a table
 * @param userQuery The report to transform
 */
function toUserQueryTableRow(userQuery: UserQuery): UserQueryTableRow {
  const { query } = userQuery;
  return {
    userQuery,
    subjectCodes: getSubjectCodes(query),
    schoolYears: getSchoolYears(query)
  };
}

@Component({
  selector: 'user-query-table',
  templateUrl: './user-query-table.component.html'
})
export class UserQueryTableComponent {
  columns: Column[] = [
    new Column({ id: 'name', field: 'userQuery.query.name' }),
    new Column({ id: 'type', field: 'userQuery.query.type' }),
    new Column({
      id: 'assessmentTypes',
      field: 'userQuery.query.assessmentTypeCode'
    }),
    new Column({ id: 'subjects', field: 'subjectCodes' }),
    new Column({ id: 'schoolYears', field: 'schoolYears' }),
    new Column({ id: 'updated', field: 'userQuery.updated' })
  ];
  rows: UserQueryTableRow[];

  @Input()
  nameTemplate: TemplateRef<any>;

  @Input()
  set userQueries(values: UserQuery[]) {
    this.rows = (values || []).map(toUserQueryTableRow);
  }
}
