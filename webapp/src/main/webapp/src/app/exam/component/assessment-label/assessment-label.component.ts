import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { gradeColor } from '../../../shared/colors';

@Component({
  selector: 'assessment-label',
  templateUrl: './assessment-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentLabelComponent {
  @Input()
  label: string;

  _gradeCode: string;
  _color: string;

  @Input()
  set gradeCode(value: string) {
    this._gradeCode = value;
    this._color = gradeColor(value);
  }
}
