import {Component, Input} from '@angular/core';
import {Breadcrumb} from "./breadcrumb";

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {

  @Input()
  private crumb: any;

  @Input()
  private first: boolean;

  @Input()
  private active: boolean;

}
