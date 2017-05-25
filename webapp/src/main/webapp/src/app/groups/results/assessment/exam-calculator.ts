import { Injectable } from "@angular/core";

@Injectable()
export class ExamCalculator {

  calculateAverage(exams) {
    return exams.reduce((x, y) => x + y.score, 0) / exams.length;
  }

  groupLevels(exams, numberOfLevels) {
    let levels = [];

    for(let i = 0; i < numberOfLevels; i++) {
      let level = i + 1;
      levels[i] =  { id: level, value: exams.filter(x => x.level == level).length };
    }

    return levels;
  }
}
