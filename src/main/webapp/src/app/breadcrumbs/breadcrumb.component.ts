import {Component, Input} from '@angular/core';
import {Breadcrumb} from "./breadcrumb";

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {

  @Input('value')
  private crumb: Breadcrumb;

}
