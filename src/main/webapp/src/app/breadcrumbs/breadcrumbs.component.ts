import {Component, Input} from '@angular/core';
import {Breadcrumb} from "./breadcrumb";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {

  private crumbs: Array<any> = [{name: 'Groups', path: '/', first: true, active: true}];

  @Input()
  set values(values: Array<any>) {
    let copy = this.crumbs.concat(values);
    copy[0].active = false;
    copy[copy.length - 1].active = true;
    this.crumbs = copy;

    console.log('crumbs:', this.crumbs)
  }

}
