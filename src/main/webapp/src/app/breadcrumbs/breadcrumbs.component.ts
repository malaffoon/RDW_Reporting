import {Component, Input, OnInit} from "@angular/core";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})
export class BreadcrumbsComponent implements OnInit{
  ngOnInit(): void {
    this.translate.get(['labels.home', 'labels.groups','labels.search.title']).subscribe((translateValues) => {
      var root = this.featureRoot === "search"
        ? { path:'/search', name: translateValues['labels.search.title'] }
        : { path:'/groups', name: translateValues['labels.groups'] };

      this.crumbs = [
        { path: '/', name: translateValues['labels.home'] },
        root
      ].concat(this.values);
    });
  }

  private crumbs: Array<any> = [];

  constructor(private translate: TranslateService) {
  }

  @Input()
  private values: Array<any>;

  @Input()
  public featureRoot: string;

}
