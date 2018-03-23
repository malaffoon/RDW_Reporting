import { AssessmentType } from "../../shared/enum/assessment-type.enum";
import { AssessmentSubjectType } from "../../shared/enum/assessment-subject-type.enum";
import { Utils } from "../../shared/support/support";

export class Assessment {
  id: number;
  label: string;
  /** @deprecated TODO this does not belong here but in a UI wrapper */
  resourceUrl: string;
  grade: string;
  /** @deprecated */ type: AssessmentType;
  /** @deprecated TODO this does not belong here but in a UI wrapper */
  selected: boolean;
  /** @deprecated */ subject: string;
  claimCodes: string[];
  cutPoints: number[];

  get typeCode(): string {
    return Utils.toAssessmentTypeCode(this.type);
  }

  get subjectCode(): string {
    return Utils.toSubjectCode(AssessmentSubjectType[ this.subject as string ]);
  }

  /** @deprecated */
  get assessmentSubjectType(): AssessmentSubjectType {
    return AssessmentSubjectType[this.subject];
  }

  get hasResourceUrl(): boolean {
    return !Utils.isNullOrUndefined(this.resourceUrl);
  }

  get isIab(): boolean {
    return this.type == AssessmentType.IAB;
  }

  get isIca(): boolean {
    return this.type == AssessmentType.ICA;
  }

  get isInterim(): boolean {
    return this.type != AssessmentType.SUMMATIVE;
  }

  get isSummative(): boolean {
    return this.type == AssessmentType.SUMMATIVE;
  }

  get isEla(): boolean {
    return this.assessmentSubjectType == AssessmentSubjectType.ELA;
  }

  get isMath(): boolean {
    return this.assessmentSubjectType == AssessmentSubjectType.MATH;
  }
}
