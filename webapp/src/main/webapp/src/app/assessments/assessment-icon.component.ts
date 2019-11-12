import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assessment } from './model/assessment';
import { Utils } from '../shared/support/support';

export const IcaAssessmentIconsBySubject = {
  Math: 'Math_ICA',
  ELA: 'ELA_ICA'
};

export const SummativeAssessmentIconsBySubject = {
  Math: 'Math_Summative',
  ELA: 'ELA_Summative',
  ELPAC: 'ELPAC',
  Science: 'Science',
  CAST: 'Science',
  CSA: 'Spanish'
};

export const AssessmentIconsByAssessmentName = {
  // IAB
  'SBAC-IAB-FIXED-G11E-BriefWrites-ELA-1': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G11E-Editing-ELA-1': 'ELA_Editing',
  'SBAC-IAB-FIXED-G11E-EditRevise-ELA-1': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G11E-LangVocab-ELA-1': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G11E-ListenInterpet-ELA-1': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G11E-Perf-Explanatory-Marshmallo': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G11E-ReadInfo-ELA-1': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G11E-ReadLit-ELA-1': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G11E-Research-ELA-1': 'ELA_Research',
  'SBAC-IAB-FIXED-G11E-Revision-ELA-1': 'ELA_Revision',
  'SBAC-IAB-FIXED-G11M-AlgLi': 'Math_HS_Algebra-and-Functions-I',
  'SBAC-IAB-FIXED-G11M-AlgLinearFu': 'Math_HS_Algebra-and-Functions-I',
  'SBAC-IAB-FIXED-G11M-AlgQua': 'Math_HS_Algebra-and-Functions-II',
  'SBAC-IAB-FIXED-G11M-AlgQuadFu': 'Math_HS_Algebra-and-Functions-II',
  'SBAC-IAB-FIXED-G11M-GCO-MATH-1': 'Math_HS_Geometry-Congruence',
  'SBAC-IAB-FIXED-G11M-GeoRightTriRatios-Calc-MATH-1':
    'Math_HS_Geometry-and-Right-Triangle-Trigonometry',
  'SBAC-IAB-FIXED-G11M-GMD-MATH-1': 'Math_HS_Geometry-Measurement-and-Modeling',
  'SBAC-IAB-FIXED-G11M-I': 'Math_HS_Interpreting-Functions',
  'SBAC-IAB-FIXED-G11M-N': 'Math_HS_Number-and-Quantity',
  'SBAC-IAB-FIXED-G11M-Perf-TeenDrivingRest-MATH-1': 'Math_HS_Performance-Task',
  'SBAC-IAB-FIXED-G11M-SP-Calc-MATH-1': 'Math_HS_Statistics-and-Probability',
  'SBAC-IAB-FIXED-G11M-SS': 'Math_HS_Seeing-Structure-in-Expressions',
  'SBAC-IAB-FIXED-G3E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G3E-Editing-ELA-': 'ELA_Editing',
  'SBAC-IAB-FIXED-G3E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G3E-LangVocab-ELA-': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G3E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G3E-Perf-Opinion-Beetle': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G3E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G3E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G3E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G3E-Revision-ELA-': 'ELA_Revision',
  'SBAC-IAB-FIXED-G3M-G-MATH-': 'Math_3-5_Geometry',
  'SBAC-IAB-FIXED-G3M-MD-MATH-': 'Math_3-5_MeasurementandData',
  'SBAC-IAB-FIXED-G3M-NBT-MATH-': 'Math_3-5_Number-and-Operations-in-Base-10',
  'SBAC-IAB-FIXED-G3M-NF-MATH-': 'Math_3-5_Number-Operations-Fractions',
  'SBAC-IAB-FIXED-G3M-OA-MATH-': 'Math_3-5_Operations-and-Algebraic-Thinking',
  'SBAC-IAB-FIXED-G3M-Perf-OrderForm-MATH-':
    'Math_3-5_Mathematics-Performance-Task',
  'SBAC-IAB-FIXED-G4E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G4E-Editing-ELA-': 'ELA_Editing',
  'SBAC-IAB-FIXED-G4E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G4E-LangVocab-ELA-': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G4E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G4E-Perf-Narrative-UnlikelyAnima': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G4E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G4E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G4E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G4E-Revision-ELA-': 'ELA_Revision',
  'SBAC-IAB-FIXED-G4M-G-MATH-': 'Math_3-5_Geometry',
  'SBAC-IAB-FIXED-G4M-MD-MATH-': 'Math_3-5_MeasurementandData',
  'SBAC-IAB-FIXED-G4M-NBT-MATH-': 'Math_3-5_Number-and-Operations-in-Base-10',
  'SBAC-IAB-FIXED-G4M-NF-MATH-': 'Math_3-5_Number-Operations-Fractions',
  'SBAC-IAB-FIXED-G4M-OA-MATH-': 'Math_3-5_Operations-and-Algebraic-Thinking',
  'SBAC-IAB-FIXED-G4M-Perf-AnimalJumping-MATH-':
    'Math_3-5_Mathematics-Performance-Task',
  'SBAC-IAB-FIXED-G5E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G5E-Editing-ELA-': 'ELA_Editing',
  'SBAC-IAB-FIXED-G5E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G5E-LangVocab-ELA-': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G5E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G5E-Perf-Narrative-Whale': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G5E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G5E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G5E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G5E-Revision-ELA-': 'ELA_Revision',
  'SBAC-IAB-FIXED-G5M-G-MATH-': 'Math_3-5_Geometry',
  'SBAC-IAB-FIXED-G5M-MD-MATH-': 'Math_3-5_MeasurementandData',
  'SBAC-IAB-FIXED-G5M-NBT-MATH-': 'Math_3-5_Number-and-Operations-in-Base-10',
  'SBAC-IAB-FIXED-G5M-NF-MATH-': 'Math_3-5_Number-Operations-Fractions',
  'SBAC-IAB-FIXED-G5M-OA-MATH-': 'Math_3-5_Operations-and-Algebraic-Thinking',
  'SBAC-IAB-FIXED-G5M-Perf-TurtleHabitat-MATH-':
    'Math_3-5_Mathematics-Performance-Task',
  'SBAC-IAB-FIXED-G6E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G6E-Editing-ELA-': 'ELA_Editing',
  'SBAC-IAB-FIXED-G6E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G6E-LangVocab-ELA-': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G6E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G6E-Perf-Argument-Multivitamin': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G6E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G6E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G6E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G6E-Revision-ELA-': 'ELA_Revision',
  'SBAC-IAB-FIXED-G6M-E': 'Math_6-7_Expressions-and-Equations',
  'SBAC-IAB-FIXED-G6M-G-Calc-MATH-': 'Math_6-7_Geometry',
  'SBAC-IAB-FIXED-G6M-N': 'Math_6-7_The-Number-System',
  'SBAC-IAB-FIXED-G6M-Perf-CellPhonePlan-MATH-':
    'Math_6-7_Mathematics-Performance-Task',
  'SBAC-IAB-FIXED-G6M-R': 'Math_6-7_Ratio-and-Proportional-Relationships',
  'SBAC-IAB-FIXED-G6M-S': 'Math_6-7_Statistics-and-Probability',
  'SBAC-IAB-FIXED-G7E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G7E-Editing-ELA-': 'ELA_Editing',
  'SBAC-IAB-FIXED-G7E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G7E-LangVocab-ELA-': 'ELA_Language-and-Vocabulary-Use',
  'SBAC-IAB-FIXED-G7E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G7E-Perf-Explanatory-MobileEdTec': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G7E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G7E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G7E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G7E-Revision-ELA-': 'ELA_Revision',
  'SBAC-IAB-FIXED-G7M-E': 'Math_6-7_Expressions-and-Equations',
  'SBAC-IAB-FIXED-G7M-': 'Math_6-7_Geometry',
  'SBAC-IAB-FIXED-G7M-N': 'Math_6-7_The-Number-System',
  'SBAC-IAB-FIXED-G7M-Perf-CampingTasks-MATH-':
    'Math_6-7_Mathematics-Performance-Task',
  'SBAC-IAB-FIXED-G7M-RP-Calc-MATH-':
    'Math_6-7_Ratio-and-Proportional-Relationships',
  'SBAC-IAB-FIXED-G7M-SP-Calc-MATH-': 'Math_6-7_Statistics-and-Probability',
  'SBAC-IAB-FIXED-G8E-BriefWrites-ELA-': 'ELA_Brief-Write',
  'SBAC-IAB-FIXED-G8E-EditRevise-ELA-': 'ELA_Edit-Revise',
  'SBAC-IAB-FIXED-G8E-ListenInterpet-ELA-': 'ELA_Listen-and-Interpret',
  'SBAC-IAB-FIXED-G8E-Perf-Explanatory-CompareAncien': 'ELA_Performance_Task',
  'SBAC-IAB-FIXED-G8E-ReadInfo-ELA-': 'ELA_Read-Informational-Texts',
  'SBAC-IAB-FIXED-G8E-ReadLit-ELA-': 'ELA_Read-Literary-Texts',
  'SBAC-IAB-FIXED-G8E-Research-ELA-': 'ELA_Research',
  'SBAC-IAB-FIXED-G8M-E': 'Math_8_Expressions-and-Equations_1',
  'SBAC-IAB-FIXED-G8M-EE2-Calc-MATH-': 'Math_8_Expressions-and-Equations-2',
  'SBAC-IAB-FIXED-G8M-F-Calc-MATH-': 'Math_8_Functions',
  'SBAC-IAB-FIXED-G8M-G-Calc-MATH-': 'Math_8_Geometry',
  'SBAC-IAB-FIXED-G8M-NS-MATH-': 'Math_8_The-Number-System',
  'SBAC-IAB-FIXED-G8M-Perf-BaseballTickets-MATH-': 'Math_8_Performance-Task',

  //  FIAB
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-11': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-3': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-4': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-5': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-6': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-7': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchAnalyzeInfo-8': 'ELA_Research-Analyze-Information',
  'SBAC-IAB-ELA-ResearchInterpInteg-11': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-3': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-4': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-5': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-6': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-7': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-ResearchInterpInteg-8': 'ELA_Research-Interpret-Integrate',
  'SBAC-IAB-ELA-WriteNarrative-11': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-3': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-4': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-5': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-6': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-7': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-ELA-WriteNarrative-8': 'ELA_Write-Revise-Narratives',
  'SBAC-IAB-MATH-TAOA-3':
    'Math_3_Multiplication-Division-Interpret-Represent-Solve',
  'SBAC-IAB-MATH-TAOA-4': 'Math_4_Four-Operations-Interpret-Represent-Solve',
  'SBAC-IAB-MATH-TAOA-5': 'Math_5_Numerical-Expressions',
  'SBAC-IAB-MATH-TBNS-6': 'Math_6_Divide-Fractions-by-Fractions',
  'SBAC-IAB-MATH-TBOA-3': 'Math_3_Properties-Multiplication-Division',
  'SBAC-IAB-MATH-TCEE-7': 'Math_7_Equivalent-Expressions',
  'SBAC-IAB-MATH-TCEE-8':
    'Math_8_Proportional-Relationships-Lines-Linear-Equations',
  'SBAC-IAB-MATH-TCOA-3': 'Math_3_Multiply-Divide-within-100',
  'SBAC-IAB-MATH-TDEE-7': 'Math_7_Algebraic-Expressions-Equations',
  'SBAC-IAB-MATH-TDEE-8': 'Math_8_Analyze-Solve-Linear-Equations',
  'SBAC-IAB-MATH-TDNBT-5': 'Math_5_Operations-with-Whole-Numbers-Decimals',
  'SBAC-IAB-MATH-TEG-7': 'Math_7_Geometric-Figures',
  'SBAC-IAB-MATH-TENF-5': 'Math_5_Add-Subtract-with-Equivalent-Fractions',
  'SBAC-IAB-MATH-TFEE-6': 'Math_6_One-Variable-Expressions-Equations',
  'SBAC-IAB-MATH-TFNF-4': 'Math_4_Fraction-Equivalence-Ordering',
  'SBAC-IAB-MATH-TGEE-6-Calc': 'Math_6_Dependent-Independent-Variables',
  'SBAC-IAB-MATH-TGG-8': 'Math_8_Congruence-Similarity',
  'SBAC-IAB-MATH-THNF-4': 'Math_4_Fractions-Decimal-Notation',
  'SBAC-IAB-MATH-THREI-11': 'Math_HS_Equations-Reasoning',
  'SBAC-IAB-MATH-TIREILinExp-11':
    'Math_HS_Solve-Equations-Inequalities-Linear-Exponential',
  'SBAC-IAB-MATH-TIREIQuad-11':
    'Math_HS_Solve-Equations-Inequalities-Quadratic',

  // old or demo icons
  'SBAC-IAB-G11-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G11-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G3-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G3-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G4-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G4-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G5-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G5-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G6-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G6-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G7-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G7-Math-COMBINED': 'Math_ICA',
  'SBAC-IAB-G8-ELA-COMBINED': 'ELA_ICA',
  'SBAC-IAB-G8-Math-COMBINED': 'Math_ICA',
  'SBAC-IRP-B1-ELA-3': 'ELA_Read-Literary-Texts',
  'SBAC-IRP-B1-ELA-7': 'ELA_Read-Literary-Texts',
  'SBAC-IRP-B2-ELA-3': 'ELA_Read-Informational-Texts',
  'SBAC-IRP-B2-ELA-7': 'ELA_Read-Informational-Texts',
  'SBAC-IRP-ELA-11-IAB-PT': 'ELA_Performance_Task',
  'SBAC-IRP-ELA-3-IAB-PT': 'ELA_Performance_Task',
  'SBAC-IRP-ELA-7-IAB-PT': 'ELA_Performance_Task',
  'SBAC-IRP-MATH-11-IAB-PT': 'Math_HS_Performance-Task',
  'SBAC-IRP-MATH-3-IAB-PT': 'Math_3-5_Mathematics-Performance-Task',
  'SBAC-IRP-MATH-7-IAB-PT': 'Math_6-7_Mathematics-Performance-Task'
};

@Component({
  selector: 'assessment-icon',
  template: `
    <sb-icon
      *ngIf="icon"
      [icon]="'assessment-icons/' + icon"
      [styles]="styles"
    ></sb-icon>
  `,
  host: {
    class: 'assessment-icon'
  }
})
export class AssessmentIconComponent {
  @Input()
  styles: any;

  @Output()
  missingIcon: EventEmitter<boolean> = new EventEmitter(true);

  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  @Input()
  set assessment(value: Assessment) {
    switch (value.type) {
      case 'ica':
        this._icon = IcaAssessmentIconsBySubject[value.subject];
        break;
      case 'sum':
        this._icon = SummativeAssessmentIconsBySubject[value.subject];
        break;
      default:
        this._icon = AssessmentIconsByAssessmentName[value.name];
        break;
    }

    if (Utils.isNullOrUndefined(this._icon)) {
      this.missingIcon.emit(true);
    }
  }
}
