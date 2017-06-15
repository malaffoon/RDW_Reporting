import { Injectable } from "@angular/core";
import { Grade } from "./model/grade.model";

@Injectable()
export class GradeService {
  private grades : Grade[] = [
    new Grade(3, 'orange'),
    new Grade(4, 'green'),
    new Grade(5, 'teal'),
    new Grade(6, 'blue-dark'),
    new Grade(7, 'maroon'),
    new Grade(8, 'green-dark'),
    new Grade(9, 'blue-dark'),
  ];

  getGrades() {
    return this.grades;
  }

  getColor(id) {
    if(!id)
      return "";

    let gradeId = this.ensureRange(3, 9, id);
    return this.getGrades().find(x => x.id == gradeId).color;
  }

  private ensureRange(min, max, value){
    return Math.max(min, Math.min(max, value));
  }
}
