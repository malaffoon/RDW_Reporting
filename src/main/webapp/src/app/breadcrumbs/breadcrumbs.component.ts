import {Component, Input} from '@angular/core';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {

  links: Array<any>;
  location: string;

  @Input('values')
  set values(values: Array<any>) {
    let copy = values.concat();
    this.location = copy.pop().name;
    this.links = copy;
  }

}

class Breadcrumb {
  readonly path?: string;
  readonly name: string;
}

