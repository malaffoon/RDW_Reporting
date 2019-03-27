import { Filter } from './filter';

/**
 * Represents all available exam search filters options
 */
export interface ServerExamSearchFilters {
  /**
   * The schools years for which there are exams
   */
  schoolYears: number[];

  /**
   * The subject codes
   */
  subjects: string[];

  /**
   * Student filters
   */
  studentFilters: Filter[];

  // The entire advanced filter set could be backend configured
  // advancedFilters: FilterGroup[];
  // This is group/school grade specific and should not be cached
  // assessments: Assessment[];
}

export interface ExamSearchFilters extends ServerExamSearchFilters {}

/**
 * Converts the server model to the local model
 *
 * @param serverFilters The server models
 */
export function toExamSearchFilters(
  serverFilters: ServerExamSearchFilters
): ExamSearchFilters {
  return serverFilters;
}
