import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { SubjectAssessmentType } from './subject';

const MathScoreableClaims = [
  '1',
  'SOCK_2',
  '3'
];

const ELAScoreableClaims = [
  'SOCK_R',
  'SOCK_LS',
  '2-W',
  '4-CR'
];

const SubjectAssessmentTypes = [
  {
    subject: 'Math',
    assessmentType: 'ica'
  },
  {
    subject: 'Math',
    assessmentType: 'iab'
  },
  {
    subject: 'Math',
    assessmentType: 'sum'
  },
  {
    subject: 'ELA',
    assessmentType: 'ica'
  },
  {
    subject: 'ELA',
    assessmentType: 'iab'
  },
  {
    subject: 'ELA',
    assessmentType: 'sum'
  }
].map(type => {

  const iab = type.assessmentType === 'iab';
  const scoreableClaims = type.subject === 'Math'
    ? MathScoreableClaims
    : ELAScoreableClaims;

  return Object.assign({}, type, {
    performanceLevelStandardCutoff: iab ? undefined : 3,
    performanceLevelCount: iab ? 3 : 4,
    scoreableClaims: scoreableClaims,
    scoreableClaimPerformanceLevelCount: iab ? 0 : 3
  });
});

const DefinitionsBySubjectAndAssessmentType: { [ key: string ]: SubjectAssessmentType } = SubjectAssessmentTypes.reduce((map, type) => {
  const { subject, assessmentType } = type;
  map[ `${subject}/${assessmentType}` ] = type;
  return map;
}, {});

@Injectable()
export class SubjectService {

  getSubjectCodes(): Observable<string[]> {
    return of([ 'Math', 'ELA' ]);
  }

  getSubjectDefinition(subject: string, assessmentType: string): Observable<SubjectAssessmentType> {
    return of(DefinitionsBySubjectAndAssessmentType[ `${subject}/${assessmentType}` ]);
  }

  getSubjectDefinitionForAssessment({ type, subject }): Observable<SubjectAssessmentType> {
    return this.getSubjectDefinition(subject, type);
  }

}
