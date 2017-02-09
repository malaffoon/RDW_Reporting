import {Assessment} from "./assessment";

/**
 * Represents the event of an exam being taken
 */
export interface Exam {

  readonly id: number;
  readonly date: Date;
  readonly performance: number;
  readonly score: number;
  readonly grade: number;

  readonly assessment: Assessment;

}
