import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tenant-metrics-table',
  templateUrl: './tenant-metrics-table.component.html',
  styleUrls: ['./tenant-metrics-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantMetricsTable {
  @Input()
  metrics: any;
}
