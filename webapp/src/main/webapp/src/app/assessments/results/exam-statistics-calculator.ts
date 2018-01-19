import { Injectable } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";
import { ExamStatisticsLevel } from "../model/exam-statistics.model";
import { Exam } from "../model/exam.model";
import { DynamicItemField } from "../model/item-point-field.model";
import * as math from "mathjs";
import {WritingTraitScoreSummary} from "../model/writing-trait-scores.model";

@Injectable()
export class ExamStatisticsCalculator {
  private readonly NumberFieldPrefix = "number-point_";
  private readonly PercentFieldPrefix = "percent-point_";

  private readonly potentialResponses = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  calculateAverage(exams: Exam[]) {
    let scoredExams = this.getOnlyScoredExams(exams);
    return scoredExams.reduce((x, y) => x + y.score, 0)
      / scoredExams.length;
  }

  /**
   * Calculates the standard error of the mean
   *  = Standard Deviation / sqrt(N)  where N is the number of scores
   *
   * @param exams
   * @returns {number}
   */
  calculateStandardErrorOfTheMean(exams: Exam[]) {
    let scoredExams = this.getOnlyScoredExams(exams);
    let scores = scoredExams.map(x => x.score);

    if (scores.length == 0) {
      return 0;
    }

    return math.std(scores) / math.sqrt(scores.length);
  }

  getOnlyScoredExams(exams: Exam[]): Exam[] {
    return exams.filter(x => x && x.score);
  }

  groupLevels(exams, numberOfLevels): ExamStatisticsLevel[] {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }

  mapGroupLevelsToPercents(levels: ExamStatisticsLevel[]): ExamStatisticsLevel[] {
    let total = levels.reduce((x, y) => x + y.value, 0);
    return levels.map(x => {
      return {
        id: x.id,
        value: total == 0 ? 0 : x.value / total * 100,
        suffix: '%'
      }
    });
  }

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for (let item of assessmentItems) {
      for (let i = 0; i <= item.maxPoints; i++) {
        if (item.scores.length > 0) {
          let count = item.scores.filter(x => x.points == i).length;
          item[ this.NumberFieldPrefix + i ] = count;
          item[ this.PercentFieldPrefix + i ] = count / item.scores.length * 100;
        }
        else {
          item[ this.NumberFieldPrefix + i ] = 0;
          item[ this.PercentFieldPrefix + i ] = 0;
        }
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let max = assessmentItems.reduce((x, y) => x.maxPoints > y.maxPoints ? x : y).maxPoints;
    let pointFields: DynamicItemField[] = [];

    for (let i = 0; i <= max; i++) {
      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + i;
      column.percentField = this.PercentFieldPrefix + i;
      column.label = i.toString();
      pointFields.push(column);
    }

    return pointFields;
  }

  aggregateWritingTraitScores(assessmentItems: AssessmentItem[]) : WritingTraitScoreSummary[] {
    let summary: WritingTraitScoreSummary[] = [];

    // setup the basic structure
    let summaryItem = new WritingTraitScoreSummary();
    summaryItem.category = "Organization / Purpose";
    // summaryItem.average = 1.4;
    summaryItem.maxPoints = 4;
    summaryItem.numbers = [0, 0, 0, 0, 0];
    summaryItem.percents = [0, 0, 0, 0, 0];
    summary.push(summaryItem);

    summaryItem = new WritingTraitScoreSummary();
    summaryItem.category = "Evidence / Elaboration";
    // summaryItem.average = 3.5;
    summaryItem.maxPoints = 4;
    summaryItem.numbers = [0, 0, 0, 0, 0];
    summaryItem.percents = [0, 0, 0, 0, 0];
    summary.push(summaryItem);

    summaryItem = new WritingTraitScoreSummary();
    summaryItem.category = "Conventions";
    // summaryItem.average = 1.8;
    summaryItem.maxPoints = 2;
    summaryItem.numbers = [0, 0, 0];
    summaryItem.percents = [0, 0, 0];
    summary.push(summaryItem);

    summaryItem = new WritingTraitScoreSummary();
    summaryItem.category = "Total Points";
    summaryItem.maxPoints = 6;
    summaryItem.numbers = [0, 0, 0, 0, 0, 0, 0];
    summaryItem.percents = [0, 0, 0, 0, 0, 0, 0];
    summary.push(summaryItem);

    let totalAnswers = 0;
    for (let item of assessmentItems) {
      let items = item.scores.filter(x => x.writingTraitScores != null);
      totalAnswers = items.length;

      summary[0].numbers[0] = items.filter(x => x.writingTraitScores.organization == null || x.writingTraitScores.organization == 0).length;
      summary[0].numbers[1] = items.filter(x => x.writingTraitScores.organization == 1).length;
      summary[0].numbers[2] = items.filter(x => x.writingTraitScores.organization == 2).length;
      summary[0].numbers[3] = items.filter(x => x.writingTraitScores.organization == 3).length;
      summary[0].numbers[4] = items.filter(x => x.writingTraitScores.organization == 4).length;

      summary[1].numbers[0] = items.filter(x => x.writingTraitScores.evidence == null || x.writingTraitScores.evidence == 0).length;
      summary[1].numbers[1] = items.filter(x => x.writingTraitScores.evidence == 1).length;
      summary[1].numbers[2] = items.filter(x => x.writingTraitScores.evidence == 2).length;
      summary[1].numbers[3] = items.filter(x => x.writingTraitScores.evidence == 3).length;
      summary[1].numbers[4] = items.filter(x => x.writingTraitScores.evidence == 4).length;

      summary[2].numbers[0] = items.filter(x => x.writingTraitScores.conventions == null || x.writingTraitScores.conventions == 0).length;
      summary[2].numbers[1] = items.filter(x => x.writingTraitScores.conventions == 1).length;
      summary[2].numbers[2] = items.filter(x => x.writingTraitScores.conventions == 2).length;
      summary[2].numbers[3] = items.filter(x => x.writingTraitScores.conventions == 3).length;
      summary[2].numbers[4] = items.filter(x => x.writingTraitScores.conventions == 4).length;

      summary[3].numbers[0] = items.filter(x => x.points == 0).length;
      summary[3].numbers[1] = items.filter(x => x.points == 1).length;
      summary[3].numbers[2] = items.filter(x => x.points == 2).length;
      summary[3].numbers[3] = items.filter(x => x.points == 3).length;
      summary[3].numbers[4] = items.filter(x => x.points== 4).length;
    }

    // now calc averages
    for (let row of summary) {
      let total = 0;
      let count = 0;



      row.numbers.forEach((num, index) => {
        total += num * index;
        count += num;

        row.percents[index] = totalAnswers == 0 ? 0 : num / totalAnswers * 100;
      });

      row.average = count == 0 ? 0 : total / count;
    }

    console.log(summary);

    return summary;
  }

  aggregateItemsByResponse(assessmentItems: AssessmentItem[]) {
    for (let item of assessmentItems) {
      this.assertNumberOfChoicesIsValid(item.numberOfChoices);

      for (let i = 0; i < item.numberOfChoices; i++) {
        let response = this.potentialResponses[ i ];

        if (item.scores.length > 0) {
          let compareFunction = item.type == 'MS'
            ? (x => x.response != null && x.response.indexOf(response) !== -1)
            : (x => x.response == response);

          let count = item.scores.filter(compareFunction).length;
          item[ this.NumberFieldPrefix + response ] = count;
          item[ this.PercentFieldPrefix + response ] = count / item.scores.length * 100;
        }
        else {
          item[ this.NumberFieldPrefix + response ] = 0;
          item[ this.PercentFieldPrefix + response ] = 0;
        }
      }
    }
  }

  getChoiceFields(assessmentItems: AssessmentItem[]): DynamicItemField[] {
    let maxNumberOfChoices = assessmentItems.reduce((x, y) => x.numberOfChoices > y.numberOfChoices ? x : y).numberOfChoices;
    this.assertNumberOfChoicesIsValid(maxNumberOfChoices);

    let pointFields: DynamicItemField[] = [];
    for (let i = 0; i < maxNumberOfChoices; i++) {
      let response = this.potentialResponses[ i ];

      let column: DynamicItemField = new DynamicItemField();
      column.numberField = this.NumberFieldPrefix + response;
      column.percentField = this.PercentFieldPrefix + response;
      column.label = response;
      pointFields.push(column);
    }

    return pointFields;
  }

  assertNumberOfChoicesIsValid(numberOfChoices) {
    // Assert we have a defined potential response for the given number of choices.
    if (numberOfChoices >= this.potentialResponses.length) {
      throw Error("Undefined potential response for given number of choices.");
    }
  }
}
