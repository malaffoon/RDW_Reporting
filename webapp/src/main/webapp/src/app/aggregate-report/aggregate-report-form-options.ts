import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";

/**
 * Represents the options available in the aggregate report form
 */
export interface AggregateReportFormOptions {

  assessmentGrades: SbCheckboxGroupOption[];
  assessmentTypes: SbToggleOption[];
  completenesses: SbCheckboxGroupOption[];
  ethnicities: SbCheckboxGroupOption[];
  genders: SbCheckboxGroupOption[];
  interimAdministrationConditions: SbCheckboxGroupOption[];
  summativeAdministrationConditions: SbCheckboxGroupOption[];
  schoolYears: SbCheckboxGroupOption[];
  subjects: SbCheckboxGroupOption[];
  migrantStatuses: SbCheckboxGroupOption[];
  ieps: SbCheckboxGroupOption[];
  plan504s: SbCheckboxGroupOption[];
  limitedEnglishProficiencies: SbCheckboxGroupOption[];
  economicDisadvantages: SbCheckboxGroupOption[];

}

