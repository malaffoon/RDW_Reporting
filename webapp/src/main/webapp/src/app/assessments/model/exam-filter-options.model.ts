import { Filter } from '../../exam/model/filter';

export class ExamFilterOptions {
  schoolYears: number[] = [];
  ethnicities: string[] = [];
  genders: string[] = [];
  elasCodes: string[] = [];
  subjects: string[] = [];
  languages: string[] = [];
  hasSummative: boolean = false;
  hasInterim: boolean = false;
  militaryConnectedCodes: string[] = [];
  studentFilters: Filter[] = [];
}
