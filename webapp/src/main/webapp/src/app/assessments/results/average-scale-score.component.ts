import { Component, Input } from "@angular/core";
import { Exam } from "../model/exam.model";
import { AssessmentExam } from "../model/assessment-exam.model";
import { ExamStatistics, ExamStatisticsLevel } from "../model/exam-statistics.model";

/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html',
})
export class AverageScaleScoreComponent {
  showValuesAsPercent: boolean = true;

  @Input()
  public assessmentExam: AssessmentExam;

  @Input()
  public statistics: ExamStatistics;

  get showIab(): boolean {
    return this.assessmentExam.assessment.isIab && this.statistics.total > 0;
  }

  get showIcaSummative(): boolean {
    return !this.assessmentExam.assessment.isIab && this.statistics.total > 0;
  }

  get examLevelEnum() {
    return this.assessmentExam.assessment.isIab
      ? "enum.iab-category."
      : "enum.achievement-level.";
  }

  get performanceLevels(): ExamStatisticsLevel[] {
    if (this.showValuesAsPercent)
      return this.statistics.percents;
    else
      return this.statistics.levels;
  }

  getLevelPercent(num: number): number {
    console.log(this.statistics.levels);
    console.log(this.statistics.percents);
    return this.statistics.levels[num].value;
  }
}
