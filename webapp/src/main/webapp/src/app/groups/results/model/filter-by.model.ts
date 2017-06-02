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

  get all() {
    let all = [];
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        if(i == "offGradeAssessment" && this[i] === false)
          continue;

        if(this[i] >= 0){
          all.push(i);
        }
      }
    }

    return all;
  }
}
