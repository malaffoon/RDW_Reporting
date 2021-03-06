import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { AssessmentItem } from '../model/assessment-item.model';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';
import { Exam } from '../model/exam';
import { Angulartics2 } from 'angulartics2';
import { StudentResponsesAssessmentItem } from '../model/student-responses-item.model';

@Component({
  selector: 'item-tab',
  templateUrl: './item-tab.component.html'
})
export class ItemTabComponent implements AfterViewInit {
  @Input()
  subject: string;

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
   * Shows the response if true in the item-viewer tab
   */
  @Input()
  showResponse: boolean = true;

  /**
   * Should show item details such as the Item Viewer, Exemplar, and Item Info.
   * Typically this should be false if the assessment type is Summative.
   */
  @Input()
  showItemDetails: boolean;

  /**
   * The student response assessment item wrapper that includes the writing trait scores.
   */
  @Input()
  responsesAssessmentItem: StudentResponsesAssessmentItem;

  @Input()
  response: any;

  @Input()
  showStudentScores: boolean = true;

  /**
   * If true, adds a column to the student scores which is the student's response.
   */
  @Input()
  includeResponseInStudentScores: boolean = false;

  @Input()
  writingTraits: string[] = [];

  @Input()
  set position(value: number) {
    this._position = value;
  }

  get position(): number {
    if (this._position > 0) return this._position;
    return this.item.position > 0 ? this.item.position : -1;
  }

  @ViewChild('itemTabs')
  itemTabs: TabsetComponent;

  /**
   * If set to true, item-viewer (and iris) will be loaded and added to the dom.
   */
  loadItemViewer: boolean = false;

  /**
   * If set to true, item-exemplar will be loaded and added to the dom.
   */
  loadExemplar: boolean = false;

  /**
   * If set to true, item-info will be loaded and added to the dom.
   */
  loadInfo: boolean = false;

  private _position: number = -1;

  constructor(private angulartics2: Angulartics2) {}

  ngAfterViewInit(): void {
    // Unfortunate hack to "select" the initial tab
    const { tabs = [] } = this.itemTabs;
    if (tabs.length > 0) {
      const [tab] = tabs;
      tab.select.emit(tab);
    }
  }

  selectTab(tabName: string) {
    if (tabName == 'Rubric Exemplar') {
      this.loadExemplar = true;
    } else if (tabName == 'Item Viewer') {
      this.loadItemViewer = true;
    } else if (tabName == 'Item Information') {
      this.loadInfo = true;
    }

    this.trackAnalyticsEvent('ItemTabSelection', tabName);
  }

  hasWritingType(item: AssessmentItem): boolean {
    return (
      item.performanceTaskWritingType != null ||
      item.scores.some(({ writingTraitScores }) => writingTraitScores != null)
    );
  }

  private trackAnalyticsEvent(action: string, details: string) {
    this.angulartics2.eventTrack.next({
      action: action,
      properties: {
        category: 'AssessmentResults',
        label: details
      }
    });
  }
}
