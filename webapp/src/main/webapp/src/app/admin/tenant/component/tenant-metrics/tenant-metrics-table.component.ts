import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TenantMetric } from '../../model/tenant-metric';

@Component({
  selector: 'app-tenant-metrics-table',
  templateUrl: './tenant-metrics-table.component.html',
  styleUrls: ['./tenant-metrics-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantMetricsTable {
  _rows: TenantMetric[];
  _hasSubjects: boolean;

  @Input()
  set metrics(values: TenantMetric[]) {
    this._rows = values;
    this._hasSubjects = values.some(({ subjectCode }) => subjectCode != null);
  }
}
