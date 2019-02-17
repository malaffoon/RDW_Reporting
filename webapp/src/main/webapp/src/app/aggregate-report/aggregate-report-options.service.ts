import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AggregateReportOptions } from './aggregate-report-options';
import { CachingDataService } from '../shared/data/caching-data.service';
import { OrganizationMapper } from '../shared/organization/organization.mapper';
import { map } from 'rxjs/operators';
import { AggregateServiceRoute } from '../shared/service-route';
import { AssessmentTypeOrdering, BooleanOrdering, CompletenessOrdering } from '../shared/ordering/orderings';
import { AggregateReportType } from "./aggregate-report-form-settings";
import {SubjectDefinition} from "../subject/subject";

const StubReportOptions = <any>{"assessmentGrades":["03","04","05","06","07","08","11"],"assessmentTypes":["sum"],"completenesses":["Partial","Complete"],"dimensionTypes":["Gender","Ethnicity","LEP","ELAS","Language","Section504","IEP","MigrantStatus","EconomicDisadvantage","StudentEnrolledGrade"],"economicDisadvantages":["no","yes"],"ethnicities":["HispanicOrLatinoEthnicity","AmericanIndianOrAlaskaNative","Asian","BlackOrAfricanAmerican","White","NativeHawaiianOrOtherPacificIslander","DemographicRaceTwoOrMoreRaces","Filipino"],"genders":["Male","Female","Nonbinary"],"individualEducationPlans":["no","yes"],"interimAdministrationConditions":["SD","NS"],"limitedEnglishProficiencies":["no","yes"],"englishLanguageAcquisitionStatuses":["EO","EL","IFEP","RFEP","TBD"],"migrantStatuses":["no","yes","undefined"],"section504s":["no","yes","undefined"],"schoolYears":[2019,2018,2017],"subjects":[{"id":1,"code":"Math","targetReport":false,"assessmentType":"ica"},{"id":1,"code":"Math","targetReport":false,"assessmentType":"iab"},{"id":1,"code":"Math","targetReport":true,"assessmentType":"sum"},{"id":2,"code":"ELA","targetReport":false,"assessmentType":"ica"},{"id":2,"code":"ELA","targetReport":false,"assessmentType":"iab"},{"id":2,"code":"ELA","targetReport":true,"assessmentType":"sum"},{"id":3,"code":"minisub","targetReport":false,"assessmentType":"sum"},{"id":3,"code":"minisub","targetReport":false,"assessmentType":"ica"},{"id":4,"code":"newsubject","targetReport":false,"assessmentType":"iab"},{"id":4,"code":"newsubject","targetReport":false,"assessmentType":"ica"},{"id":4,"code":"newsubject","targetReport":false,"assessmentType":"sum"}],"summativeAdministrationConditions":["Valid","IN"],"claims":[{"id":1,"code":"1","subjectCode":"Math","assessmentTypeCode":"ica"},{"id":2,"code":"SOCK_2","subjectCode":"Math","assessmentTypeCode":"ica"},{"id":3,"code":"3","subjectCode":"Math","assessmentTypeCode":"ica"},{"id":4,"code":"SOCK_R","subjectCode":"ELA","assessmentTypeCode":"ica"},{"id":5,"code":"SOCK_LS","subjectCode":"ELA","assessmentTypeCode":"ica"},{"id":6,"code":"2-W","subjectCode":"ELA","assessmentTypeCode":"ica"},{"id":7,"code":"4-CR","subjectCode":"ELA","assessmentTypeCode":"ica"},{"id":8,"code":"1","subjectCode":"Math","assessmentTypeCode":"sum"},{"id":9,"code":"SOCK_2","subjectCode":"Math","assessmentTypeCode":"sum"},{"id":10,"code":"3","subjectCode":"Math","assessmentTypeCode":"sum"},{"id":11,"code":"SOCK_R","subjectCode":"ELA","assessmentTypeCode":"sum"},{"id":12,"code":"SOCK_LS","subjectCode":"ELA","assessmentTypeCode":"sum"},{"id":13,"code":"2-W","subjectCode":"ELA","assessmentTypeCode":"sum"},{"id":14,"code":"4-CR","subjectCode":"ELA","assessmentTypeCode":"sum"},{"id":15,"code":"CLAIM_1","subjectCode":"minisub","assessmentTypeCode":"ica"},{"id":16,"code":"CLAIM_1","subjectCode":"minisub","assessmentTypeCode":"sum"},{"id":17,"code":"CLAIM_2","subjectCode":"minisub","assessmentTypeCode":"ica"},{"id":18,"code":"CLAIM_2","subjectCode":"minisub","assessmentTypeCode":"sum"},{"id":19,"code":"CLAIM_1","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":20,"code":"CLAIM_1","subjectCode":"newsubject","assessmentTypeCode":"sum"},{"id":21,"code":"CLAIM_2","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":22,"code":"CLAIM_2","subjectCode":"newsubject","assessmentTypeCode":"sum"},{"id":23,"code":"CLAIM_3","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":24,"code":"CLAIM_3","subjectCode":"newsubject","assessmentTypeCode":"sum"},{"id":25,"code":"CLAIM_4","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":26,"code":"CLAIM_4","subjectCode":"newsubject","assessmentTypeCode":"sum"},{"id":27,"code":"CLAIM_5","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":28,"code":"CLAIM_5","subjectCode":"newsubject","assessmentTypeCode":"sum"},{"id":29,"code":"CLAIM_6","subjectCode":"newsubject","assessmentTypeCode":"ica"},{"id":30,"code":"CLAIM_6","subjectCode":"newsubject","assessmentTypeCode":"sum"}],"languages":["eng","spa","vie","chi","kor","fil","por","mnd","jpn","mkh","lao","ara","arm","bur","dut","per","fre","ger","gre","cha","heb","hin","hmn","hun","ilo","ind","ita","pan","rus","smo","tha","tur","ton","urd","ceb","sgn","ukr","chz","pus","pol","syr","guj","yao","rum","taw","lau","mah","oto","map","kur","bat","toi","afa","alb","tir","som","ben","tel","tam","mar","kan","amh","bul","kik","kas","swe","zap","uzb","und","mis"],"statewideReporter":true};


const ServiceRoute = AggregateServiceRoute;
const assessmentTypeComparator = AssessmentTypeOrdering.compare;
const booleanComparator = BooleanOrdering.compare;
const completenessComparator = CompletenessOrdering.compare;



/**
 * Service responsible for gathering aggregate report options from the server
 */
@Injectable()
export class AggregateReportOptionsService {

  constructor(private dataService: CachingDataService,
              private organizationMapper: OrganizationMapper) {
  }



  getReportOptions(): Observable<AggregateReportOptions> {
    return of(StubReportOptions).pipe(
    // return this.dataService.get(`${ServiceRoute}/reportOptions`).pipe(
      map(serverOptions => <AggregateReportOptions>{
        assessmentGrades: serverOptions.assessmentGrades.concat(),
        assessmentTypes: serverOptions.assessmentTypes.concat().sort(assessmentTypeComparator),
        claims: this.mapClaims(serverOptions.claims.concat()),
        completenesses: serverOptions.completenesses.concat().sort(completenessComparator),
        defaultOrganization: serverOptions.defaultOrganization
          ? this.organizationMapper.map(serverOptions.defaultOrganization)
          : undefined,
        dimensionTypes: serverOptions.dimensionTypes.concat(),
        interimAdministrationConditions: serverOptions.interimAdministrationConditions.concat(),
        queryTypes: [ 'Basic', 'FilteredSubgroup' ],
        reportTypes: serverOptions.assessmentTypes.some(x => x == 'sum')
          ? [ AggregateReportType.GeneralPopulation, AggregateReportType.LongitudinalCohort, AggregateReportType.Claim, AggregateReportType.Target ]
          : [ AggregateReportType.GeneralPopulation, AggregateReportType.Claim ],
        schoolYears: serverOptions.schoolYears.concat(),
        statewideReporter: serverOptions.statewideReporter,
        subjects: this.mapSubjects(serverOptions.subjects.concat()),
        summativeAdministrationConditions: serverOptions.summativeAdministrationConditions.concat(),
        studentFilters: {
          economicDisadvantages: serverOptions.economicDisadvantages.concat().sort(booleanComparator),
          ethnicities: serverOptions.ethnicities.concat(),
          genders: serverOptions.genders.concat(),
          individualEducationPlans: serverOptions.individualEducationPlans.concat().sort(booleanComparator),
          limitedEnglishProficiencies: serverOptions.limitedEnglishProficiencies.concat().sort(booleanComparator),
          englishLanguageAcquisitionStatuses: serverOptions.englishLanguageAcquisitionStatuses.concat(),
          migrantStatuses: serverOptions.migrantStatuses.concat().sort(booleanComparator),
          section504s: serverOptions.section504s.concat().sort(booleanComparator),
          languages: serverOptions.languages.concat(),
          militaryConnectedCodes: (serverOptions.militaryConnectedCodes ||[]).concat()
        }
      })
    );
  }

  mapClaims(claims: any[]): Claim[] {
    return claims.map(claim => <Claim>{
      assessmentType: claim.assessmentTypeCode,
      subject: claim.subjectCode,
      code: claim.code
    });
  }

  mapSubjects(subjects: any[]): Subject[] {
    return subjects.map(subject => <Subject>{
      assessmentType: subject.assessmentType,
      code: subject.code,
      targetReport: subject.targetReport
    });
  }

}

export interface Claim {
  readonly assessmentType: string;
  readonly subject: string;
  readonly code: string;
}

export interface Subject {
  readonly code: string;
  readonly assessmentType: string;
  readonly targetReport?: boolean;
}
