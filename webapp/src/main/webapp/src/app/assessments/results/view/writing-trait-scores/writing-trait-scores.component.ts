import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AssessmentItem } from "../../../model/assessment-item.model";
import { Exam } from "../../../model/exam.model";
import { DynamicItemField } from "../../../model/item-point-field.model";
import { ExamStatisticsCalculator } from "../../exam-statistics-calculator";
import { AssessmentProvider } from "../../../assessment-provider.interface";
import { ExportRequest } from "../../../model/export-request.model";
import { Assessment } from "../../../model/assessment.model";
import { Angulartics2 } from "angulartics2";
import { RequestType } from "../../../../shared/enum/request-type.enum";
import { ExportResults } from "../../assessment-results.component";
import {WritingTraitScoreSummary} from "../../../model/writing-trait-scores.model";

@Component({
  selector: 'writing-trait-scores',
  templateUrl: './writing-trait-scores.component.html'
})
export class WritingTraitScoresComponent implements OnInit, ExportResults {
  /**
   * If true, values will be shown as percentages
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  assessmentProvider: AssessmentProvider;

  /**
   * The assessment
   */
  @Input()
  assessment: Assessment;

  /**
   * The exams to show items for.
   */
  @Input()
  set exams(value: Exam[]) {
    this._exams = value;

    if (this.filteredItems) {
      this.filteredItems = this.filterItems(this._writingTraitScoredItems);
      this.traitScoreSummary = this.examCalculator.aggregateWritingTraitScores(this.filteredItems);
    }
  }

  get exams() {
    return this._exams;
  }

  loading: boolean = false;
  pointColumns: DynamicItemField[];
  traitScoreSummary: WritingTraitScoreSummary[] = [];

  private _writingTraitScoredItems: AssessmentItem[];
  private filteredItems: AssessmentItem[];
  private _exams: Exam[];

  constructor(private examCalculator: ExamStatisticsCalculator, private renderer: Renderer2, private angulartics2: Angulartics2) {
  }

  ngOnInit() {
    this.loading = true;

    this.assessmentProvider.getAssessmentItems(this.assessment.id, ['WER']).subscribe(assessmentItems => {
      this.pointColumns = this.examCalculator.getPointFields(assessmentItems);
      let numOfScores = assessmentItems.reduce((x, y) => x + y.scores.length, 0);

      if (numOfScores != 0) {
        this._writingTraitScoredItems = assessmentItems;

        this.filteredItems = this.filterItems(assessmentItems);
        this.traitScoreSummary = this.examCalculator.aggregateWritingTraitScores(assessmentItems);
      }



      this.loading = false
    });
  }

  hasDataToExport(): boolean {
    return this.filteredItems && this.filteredItems.length > 0;
  }

  exportToCsv(): void {
    let exportRequest = new ExportRequest();
    exportRequest.assessment = this.assessment;
    exportRequest.showAsPercent = this.showValuesAsPercent;
    exportRequest.assessmentItems = this.filteredItems;
    exportRequest.pointColumns = this.pointColumns;
    exportRequest.type = RequestType.DistractorAnalysis;


    this.angulartics2.eventTrack.next({
      action: 'Export WritingTraitScores',
      properties: {
        category: 'Export'
      }
    });

    this.assessmentProvider.exportItemsToCsv(exportRequest);
  }

  getPointRowStyleClass(index: number) {
    return index == 0
      ? 'level-down'
      : '';
  }

  // Unfortunately, this is a bit of dom hijacking to set the parent <td> class to green
  // since primeng datatable does not currently support a setCellStyle function.
  // https://github.com/primefaces/primeng/issues/2157
  setTdClass(cell, item: AssessmentItem, column: DynamicItemField) {
    if (item.answerKey && item.answerKey.indexOf(column.label) !== -1) {
      let td = cell.parentNode.parentNode;
      this.renderer.addClass(td, "green");
    }
  }

  private filterItems(items: AssessmentItem[]) {
    let filtered = [];

    for (let item of items) {
      let filteredItem = Object.assign(new AssessmentItem(), item);
      filteredItem.scores = item.scores.filter(score => this._exams.some(exam => exam.id == score.examId));
      filtered.push(filteredItem);
    }

    return filtered;
  }
}
