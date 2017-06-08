import { ObservableObject } from "../../../shared/observable-object.model";

export class FilterBy extends ObservableObject {
  // Test
  private _offGradeAssessment: boolean;

  // Status
  private _administration: number = -1;
  private _summativeStatus: number = -1;
  private _completion: number = -1;

  //Student
  private _gender: number = -1;
  private _migrantStatus: number = -1;
  private _plan504: number = -1;
  private _iep: number = -1;
  private _economicDisadvantage: number = -1;
  private _limitedEnglishProficiency: number = -1;
  private _ethnicities: boolean[] = [ true ];

  get filteredEthnicities() {
    let ethnicities = [];

    for(let i in this._ethnicities) {
      if(this._ethnicities.hasOwnProperty(i) && i != "0" && this._ethnicities[i]) {
        ethnicities.push(i);
      }
    }

    return ethnicities;
  }

  get all() {
    let all = [];

    for (let i in this) {
      if (this.hasOwnProperty(i)) {
        let property = i.substring(1);

        if (property == "offGradeAssessment" && this[ i ] === false) {
          continue;
        }
        else if (property == "ethnicities") {
          let filteredEthnicities = this.filteredEthnicities;
          for (let i of filteredEthnicities) {
            all.push(property + "." + i );
          }
        }
        else if (this[ i ] >= 0) {
          all.push(property);
        }
      }
    }

    return all;
  }

  get ethnicities(): boolean[] {
    return this._ethnicities;
  }

  set ethnicities(value: boolean[]) {
    this._ethnicities = value;
    this.notifyChange('ethnicities');
  }

  get offGradeAssessment(): boolean {
    return this._offGradeAssessment;
  }

  set offGradeAssessment(value: boolean) {
    this._offGradeAssessment = value;
    this.notifyChange('offGradeAssessment');
  }

  get administration(): number {
    return this._administration;
  }

  set administration(value: number) {
    this._administration = value;
    this.notifyChange('administration');
  }

  get summativeStatus(): number {
    return this._summativeStatus;
  }

  set summativeStatus(value: number) {
    this._summativeStatus = value;
    this.notifyChange('summativeStatus');
  }

  get completion(): number {
    return this._completion;
  }

  set completion(value: number) {
    this._completion = value;
    this.notifyChange('completion');
  }

  get gender(): number {
    return this._gender;
  }

  set gender(value: number) {
    this._gender = value;
    this.notifyChange('gender');
  }

  get migrantStatus(): number {
    return this._migrantStatus;
  }

  set migrantStatus(value: number) {
    this._migrantStatus = value;
    this.notifyChange('migrantStatus');
  }

  get plan504(): number {
    return this._plan504;
  }

  set plan504(value: number) {
    this._plan504 = value;
    this.notifyChange('plan504');
  }

  get iep(): number {
    return this._iep;
  }

  set iep(value: number) {
    this._iep = value;
    this.notifyChange('iep');
  }

  get economicDisadvantage(): number {
    return this._economicDisadvantage;
  }

  set economicDisadvantage(value: number) {
    this._economicDisadvantage = value;
    this.notifyChange('economicDisadvantage');
  }

  get limitedEnglishProficiency(): number {
    return this._limitedEnglishProficiency;
  }

  set limitedEnglishProficiency(value: number) {
    this._limitedEnglishProficiency = value;
    this.notifyChange('limitedEnglishProficiency');
  }
}
