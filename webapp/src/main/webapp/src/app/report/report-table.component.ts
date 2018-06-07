import { Component, Input } from '@angular/core';
import { Report } from './report.model';

@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html'
})
export class ReportTableComponent {

  @Input()
  reports: Report[];

  columns: Column[] = [
    new Column({id: 'label-header', field: 'label'}),
    new Column({id: 'report-type-header', field: 'reportType'}),
    new Column({id: 'assessment-type-header', field: 'assessmentType'}),
    new Column({id: 'subject-header', field: 'subjectCodes'}),
    new Column({id: 'school-year-header', field: 'schoolYears'}),
    new Column({id: 'status-header', field: 'status'}),
    new Column({id: 'created-header', field: 'created'})
  ];

}


class Column {
  id: string;
  field: string;

  constructor({ id, field }) {
    this.id = id;
    this.field = field;
  }
}
