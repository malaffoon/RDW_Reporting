import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Group } from '../../groups/group';
import { MeasuredAssessment } from '../measured-assessment';
import { roundPercentages } from 'app/exam/model/score-statistics';
import { gradeColor } from '../../shared/colors';

export interface GroupCard {
  readonly group: Group;
  readonly measuredAssessment: MeasuredAssessment;
  readonly performanceLevels: number[];
}

export interface AssessmentCardEvent {
  readonly measuredAssessment: MeasuredAssessment;
  readonly selected: boolean;
}

@Component({
  selector: 'group-assessment-card',
  templateUrl: './group-assessment-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupAssessmentCardComponent {
  @Output()
  selectedAssessment: EventEmitter<AssessmentCardEvent> = new EventEmitter();

  _card: GroupCard;
  _color: string;
  _percents: number[] = [];
  _dataWidths: number[] = [];
  _studentCountFill: number;

  selected = false;

  // TODO this is needed because it is using a bootstrap column layout instead of flexbox/css grid
  hasIcon: boolean = true;

  @Input()
  set card(value: GroupCard) {
    this._card = value;
    this._color = gradeColor(value.measuredAssessment.assessment.grade);
    this._percents = value.measuredAssessment.studentCountByPerformanceLevel.map(
      x => Math.round(x.percent)
    );
    this._dataWidths = roundPercentages(
      value.measuredAssessment.studentCountByPerformanceLevel.map(
        x => x.percent
      )
    );
    this._studentCountFill = Math.min(
      Math.round(
        (value.measuredAssessment.studentsTested / value.group.totalStudents) *
          100
      ),
      100
    );
  }

  onClick(): void {
    this.selected = !this.selected;
    this.selectedAssessment.emit(<AssessmentCardEvent>{
      measuredAssessment: this._card.measuredAssessment,
      selected: this.selected
    });
  }
}
