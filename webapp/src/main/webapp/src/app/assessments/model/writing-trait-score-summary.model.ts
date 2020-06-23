import { WritingTraitAggregate } from './writing-trait-aggregate.model';
import { WritingTrait } from './writing-trait.model';
import { WritingTraitType } from './writing-trait-type.model';

/**
 * This class represents a writing trait score summary report (e.g. all of the rows of aggregate writing traits)
 */
export class WritingTraitScoreSummary {
  aggregators: Map<string, WritingTraitAggregate>;

  constructor(writingTraits) {
    this.aggregators = new Map(
      writingTraits.map(trait => [trait.type, new WritingTraitAggregate(trait)])
    );
  }

  get total() {
    return new WritingTraitAggregate(WritingTrait.total());
  }

  get rows(): WritingTraitAggregate[] {
    return Array.from(this.aggregators.values());
  }

  static InterimScoreSummary() {
    return new InterimScoreSummary();
  }
}

class InterimScoreSummary extends WritingTraitScoreSummary {
  constructor() {
    super([
      WritingTrait.evidence(),
      WritingTrait.organization(),
      WritingTrait.conventions(),
      WritingTrait.total()
    ]);
  }

  get evidence() {
    return this.aggregators.get(WritingTraitType.Evidence);
  }

  get organization() {
    return this.aggregators.get(WritingTraitType.Organization);
  }

  get conventions() {
    return this.aggregators.get(WritingTraitType.Conventions);
  }

  get total() {
    return this.aggregators.get(WritingTraitType.Total);
  }
}
