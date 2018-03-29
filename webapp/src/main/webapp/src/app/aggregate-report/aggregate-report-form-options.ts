import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";
import { SubgroupFilterFormOptions } from "./subgroup-filter-form-options";

/**
 * Represents the options available in the aggregate report form
 */
export interface AggregateReportFormOptions extends SubgroupFilterFormOptions {

  assessmentGrades: SbCheckboxGroupOption[];
  assessmentTypes: SbToggleOption[];
  completenesses: SbCheckboxGroupOption[];
  dimensionTypes: SbCheckboxGroupOption[];
  interimAdministrationConditions: SbCheckboxGroupOption[];
  performanceLevelDisplayTypes: SbToggleOption[];
  schoolYears: SbCheckboxGroupOption[];
  statewideReporter: boolean;
  subjects: SbCheckboxGroupOption[];
  summativeAdministrationConditions: SbCheckboxGroupOption[];
  valueDisplayTypes: SbToggleOption[];

}

