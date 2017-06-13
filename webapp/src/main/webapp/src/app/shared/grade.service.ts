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

}
