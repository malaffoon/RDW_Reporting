import { Utils } from "../../shared/support/support";

export class Assessment {
  id: number;
  label: string;
  grade: string;
  type: string;
  subject: string;
  claimCodes: string[];
  cutPoints: number[];

  /** @deprecated TODO this does not belong here but in a UI wrapper */
  resourceUrl: string;
  /** @deprecated TODO this does not belong here but in a UI wrapper */
  selected: boolean;

  /** @deprecated this belongs in a UI wrapper */
  get hasResourceUrl(): boolean {
    return !Utils.isNullOrUndefined(this.resourceUrl);
  }

  get isIab(): boolean {
    return this.type === 'iab';
  }

  get isIca(): boolean {
    return this.type === 'ica';
  }

  get isInterim(): boolean {
    return this.type !== 'sum';
  }

  get isSummative(): boolean {
    return this.type === 'sum';
  }

  get isEla(): boolean {
    return this.subject === 'ELA';
  }

  get isMath(): boolean {
    return this.subject === 'Math';
  }
}
