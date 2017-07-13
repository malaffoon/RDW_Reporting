import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { TabsetComponent } from "ngx-bootstrap";
import { Exam } from "../model/exam.model";

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent implements OnInit {
  /**
   * The assessment item to show in this tab.
   */
  @Input()
  item: AssessmentItem;

  /**
   * The exam results for this item.
   */
  @Input()
  exams: Exam[];

  /**
   * Should show item details such as the Item Viewer, Exemplar, and Item Info.
   * Typically this should be false if the assessment type is Summative.
   */
  @Input()
  showItemDetails: boolean;

  /**
   * If set to true, item-viewer (and iris) will be loaded and added to the dom.
   */
  loadItemViewer: boolean = false;

  /**
   * If set to true, item-exemplar will be loaded and added to the dom.
   */
  loadExemplar: boolean = false;

  get translateRoot(){
    return 'labels.assessments.items.tabs.';
  }

  constructor() { }

  ngOnInit() {
  }

}
