import { WritingTraitType } from "./writing-trait-type.model";

/**
 * This class represents one of the writing traits (Evidence, Organization, Conventions)
 */
export class WritingTrait {
  type: WritingTraitType;
  maxPoints: number;

  constructor(type: WritingTraitType, maxPoints: number) {
    this.type = type;
    this.maxPoints = maxPoints;
  }
}
