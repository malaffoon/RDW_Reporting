import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InstructionalResource } from '../../model/instructional-resource';
import { Observable } from 'rxjs';

@Component({
  selector: 'instructional-resource-popover',
  templateUrl: './instructional-resource-popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionalResourcePopoverComponent {
  @Input()
  provider: () => Observable<InstructionalResource[]>;
}
