// private AssessmentType assessmentType;
// private Set<Integer> subjectIds;
// private Set<Integer> schoolYears;
// private Set<Integer> asmtGradeIds;
// private boolean includeState;
// private boolean includeAllDistricts;
// private Map<Integer, Boolean> districts; // district ids and a flag to indicate whether to include all schools for the district
// private Set<Integer> schoolIds;
// private Set<DimensionType> dimensionTypes;
// private Set<Integer> completenessIds;
// private Set<Integer> administrativeConditionIds;
// private Set<Integer> gendersId;

import { CodedEntity } from "./aggregate-report-options";

/**
 * Client side representation of a report request.
 * This object must be mapped into a format that the server supports
 */
export class AggregateReportRequest {

  assessmentType: CodedEntity;

  subjects: CodedEntity[] = [];

  schoolYears: number[] = [];

  assessmentGrades: CodedEntity[] = [];

  includeState: boolean;

  includeAllDistricts: boolean;

  includeSchoolsByDistrict: Map<number, boolean> = new Map();

  includeDistrictBySchool: Map<number, boolean> = new Map();

  dimensionTypes: string[] = [];

  completenesses: CodedEntity[] = [];

  interimAdministrationConditions: CodedEntity[] = [];

  summativeAdministrationConditions: CodedEntity[] = [];

  validity: CodedEntity[] = [];

  genders: CodedEntity[] = [];

  ethnicities: CodedEntity[] = [];

}
