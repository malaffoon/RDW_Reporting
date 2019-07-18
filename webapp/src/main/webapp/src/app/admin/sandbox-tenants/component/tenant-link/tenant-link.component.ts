import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SandboxConfiguration } from '../../model/sandbox-configuration';

@Component({
  selector: 'app-tenant-link',
  templateUrl: './tenant-link.component.html',
  styleUrls: ['./tenant-link.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantLinkComponent {
  @Input()
  tenant: SandboxConfiguration;

  @Output()
  tenantClick: EventEmitter<SandboxConfiguration> = new EventEmitter();
}
