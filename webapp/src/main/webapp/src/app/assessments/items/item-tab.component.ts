import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AssessmentItem } from "../model/assessment-item.model";
import { TabsetComponent } from "ngx-bootstrap";

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent implements OnInit {
  @Input()
  item: AssessmentItem;

  @ViewChild('staticTabs')
  staticTabs: TabsetComponent;

  get translateRoot(){
    return 'labels.assessments.items.tabs.';
  }

  constructor() { }

  ngOnInit() {
  }

}
