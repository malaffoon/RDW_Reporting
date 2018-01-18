import { Option as SbToggleOption } from "../shared/sb-toggle.component";
import { Option as SbCheckboxGroupOption } from "../shared/form/sb-checkbox-group.component";

export interface AggregateReportFormOptions {

  assessmentGrades: SbCheckboxGroupOption[];

  assessmentTypes: SbToggleOption[];

  completenesses: SbCheckboxGroupOption[];

  interimAdministrationConditions: SbCheckboxGroupOption[];

  schoolYears: SbCheckboxGroupOption[];

  subjects: SbCheckboxGroupOption[];

  summativeAdministrationConditions: SbCheckboxGroupOption[];

}

