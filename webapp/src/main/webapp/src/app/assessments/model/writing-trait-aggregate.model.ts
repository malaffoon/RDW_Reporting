import { WritingTrait } from "./writing-trait.model";

export class WritingTraitAggregate {
  trait: WritingTrait;
  average: number;
  numbers: number[] = [];
  percents: number[] = [];

  constructor(trait: WritingTrait) {
    this.trait = trait;

    for (let i = 0; i <= trait.maxPoints; i++) {
      this.numbers.push(0);
      this.percents.push(0);
    }
  }
}
