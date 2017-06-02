export class FilterBy {
  // Test
  public offGradeAssessment: boolean;

  // Status
  public administration: number = -1;
  public summativeStatus: number = -1;
  public completion: number = -1;

  //Student
  public gender : number = -1;
  public migrantStatus : number = -1;
  public plan504 : number = -1;
  public iep : number = -1;
  public economicDisadvantage : number = -1;
  public limitedEnglishProficiency : number = -1;
  private _ethnicities : boolean[] = [ true, false, false, false, false, false, false, false, false ];

  get filteredEthnicities() {
    return this._ethnicities
      .map((val, index) => { return { val, index} })
      .filter(x => x.val && x.index > 0)
      .map(x => x.index);
  }

  get all() {
    let all = [];
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        if(i == "offGradeAssessment" && this[i] === false)
          continue;

        if(i == "_ethnicities" && this.filteredEthnicities.length > 0){
          all.push("filteredEthnicities");
        }

        if(this[i] >= 0){
          all.push(i);
        }
      }
    }

    return all;
  }


  get ethnicities(): boolean[] {
    return this._ethnicities;
  }

  set ethnicities(value: boolean[]) {
    console.log(value);
    this._ethnicities = value;
  }
}
