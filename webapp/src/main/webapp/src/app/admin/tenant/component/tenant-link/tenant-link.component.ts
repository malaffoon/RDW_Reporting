import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { TenantConfiguration } from '../../model/tenant-configuration';

@Component({
  selector: 'app-tenant-link',
  templateUrl: './tenant-link.component.html',
  styleUrls: ['./tenant-link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantLinkComponent {
  @Input()
  tenant: TenantConfiguration;

  @Output()
  tenantClick: EventEmitter<TenantConfiguration> = new EventEmitter();

  @Output()
  tenantStatusAccept: EventEmitter<TenantConfiguration> = new EventEmitter();
}
