import { WritingTraitType } from "./writing-trait-type.model";

export class WritingTrait {
  type: WritingTraitType;
  maxPoints: number;

  constructor(type: WritingTraitType, maxPoints: number) {
    this.type = type;
    this.maxPoints = maxPoints;
  }
}
