import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
}
