import { WritingTraitAggregate } from "./writing-trait-aggregate.model";
import { WritingTraitType } from "./writing-trait-type.model";
import { WritingTrait } from "./writing-trait.model";

export class WritingTraitScoreSummary {
  evidence: WritingTraitAggregate = new WritingTraitAggregate(new WritingTrait(WritingTraitType.Evidence, 4));
  organization: WritingTraitAggregate = new WritingTraitAggregate(new WritingTrait(WritingTraitType.Organization, 4));
  conventions: WritingTraitAggregate = new WritingTraitAggregate(new WritingTrait(WritingTraitType.Conventions, 2));
  total: WritingTraitAggregate = new WritingTraitAggregate(new WritingTrait(WritingTraitType.Total, 6));

  get rows(): WritingTraitAggregate[] {
    return [this.evidence, this.organization, this.conventions, this.total];
  }
}
