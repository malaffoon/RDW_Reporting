import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-heading',
  templateUrl: './page-heading.component.html',
  styleUrls: ['./page-heading.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeading {}
