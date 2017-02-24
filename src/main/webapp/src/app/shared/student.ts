import {Exam} from "./exam";

export interface Student {

  readonly id: number;
  readonly ssid: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly exams?: Array<Exam>;

}
