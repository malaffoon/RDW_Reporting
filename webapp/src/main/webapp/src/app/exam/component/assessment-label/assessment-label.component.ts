import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GradeCode } from '../../../shared/enum/grade-code.enum';
import { ColorService } from '../../../shared/color.service';

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

  constructor(private colorService: ColorService) {}

  @Input()
  set gradeCode(value: string) {
    this._gradeCode = value;
    this._color = this.colorService.getColor(GradeCode.getIndex(value));
  }
}
