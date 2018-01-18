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
