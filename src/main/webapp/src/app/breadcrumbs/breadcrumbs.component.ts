import {Component, Input} from "@angular/core";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent {

  private crumbs: Array<any> = [];

  constructor(private translate: TranslateService) {
  }

  @Input()
  set values(values: Array<any>) {
    this.translate.get(['labels.home', 'labels.groups']).subscribe((values) => {
      this.crumbs = [{path: '/', name: values['labels.home']}, {path:'/groups', name: values['labels.groups'] }].concat(values);
    });
  }

}
