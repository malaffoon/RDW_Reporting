import { CompletenessType } from "../../../shared/enum/completeness-type.enum";
import { AdministrativeConditionType } from "../../../shared/enum/administrative-condition-type.enum";

export class FilterBy {
  private _offGradeAssessment: boolean;

  private _administration: number = -1;
  private _summativeStatus: number = -1;
  private _completion: number = -1;

  get offGradeAssessment(): boolean {
    return this._offGradeAssessment;
  }

  set offGradeAssessment(value: boolean) {
    this._offGradeAssessment = value;
  }

  get administration(): number {
    return this._administration;
  }

  set administration(value: number) {
    this._administration = value;
  }

  get summativeStatus(): number {
    return this._summativeStatus;
  }

  set summativeStatus(value: number) {
    this._summativeStatus = value;
  }

  get completion(): number {
    return this._completion;
  }

  set completion(value: number) {
    this._completion = value;
  }
}
