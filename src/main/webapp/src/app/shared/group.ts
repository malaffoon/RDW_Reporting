import {Student} from "./student";
import {Exam} from "./exam";

export interface Group {

  readonly id: number;
  readonly name: string;
  readonly students?: Array<Student>;
  readonly exams?: Array<Exam>;

}
