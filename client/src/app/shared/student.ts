import {Assessment} from "./assessment";

export interface Student {

  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly assessments?: Array<Assessment>;

}
