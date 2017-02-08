import {Student} from "./student";

export interface Group {

  readonly id: number;
  readonly name: string;
  readonly students?: Array<Student>;

}
