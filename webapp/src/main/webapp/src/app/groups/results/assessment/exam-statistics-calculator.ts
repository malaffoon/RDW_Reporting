import { Injectable } from "@angular/core";
import { AssessmentItem } from "../model/assessment-item.model";

@Injectable()
export class ExamStatisticsCalculator {

  calculateAverage(exams) {
    return exams.reduce((x, y) => x + y.score, 0) / exams.length;
  }

  groupLevels(exams, numberOfLevels) {
    let levels = [];

    for (let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[ i ] = { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }

  calculateLevelPercents(levels, total) {
    return levels.map(x => {
      return {
        id: x.id,
        value: x.value / total * 100,
        suffix: '%'
      }
    })
  };

  aggregateItemsByPoints(assessmentItems: AssessmentItem[]) {
    for(let item of assessmentItems){
      for(let i=0; i <= item.maxPoints; i++){
        item["point_" + i] = item.scores.filter(x => x.points == i).length;
      }
    }
  }

  getPointFields(assessmentItems: AssessmentItem[]){
    let max = assessmentItems.reduce((x, y) => x.maxPoints > y.maxPoints ? x : y).maxPoints;
    let pointFields = [];

    for (let i = 0; i <= max; i++) {
      pointFields[ i ] = { field: "point_" + i, points: i };
    }

    return pointFields;
  }
}
