export class WritingTraitScores {
  evidence: number;
  organization: number;
  conventions: number;
}

export class WritingTraitScoreSummary {
  evidence: AggregateWritingTrait = new AggregateWritingTrait(new WritingTrait(WritingTraitType.Evidence, 4));
  organization: AggregateWritingTrait = new AggregateWritingTrait(new WritingTrait(WritingTraitType.Organization, 4));
  conventions: AggregateWritingTrait = new AggregateWritingTrait(new WritingTrait(WritingTraitType.Conventions, 2));
  total: AggregateWritingTrait = new AggregateWritingTrait(new WritingTrait(WritingTraitType.Total, 6));

  get rows(): AggregateWritingTrait[] {
    return [this.evidence, this.organization, this.conventions, this.total];
  }
}

export class AggregateWritingTrait {
  trait: WritingTrait;
  average: number;
  numbers: number[] = [];
  percents: number[] = [];

  constructor(trait: WritingTrait) {
    this.trait = trait;

    for (let i=0; i <= trait.maxPoints; i++) {
      this.numbers.push(0);
      this.percents.push(0);
    }
  }
}

export enum WritingTraitType {
  Evidence = 'evidence',
  Organization = 'organization',
  Conventions = 'conventions',
  Total = 'total'
}

export class WritingTrait {
  type: WritingTraitType;
  maxPoints: number;

  constructor(type: WritingTraitType, maxPoints: number) {
    this.type = type;
    this.maxPoints = maxPoints;
  }
}
