export interface Student {

  readonly id: number;
  readonly ssid: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly genderCode: string;
  readonly ethnicityCodes: string[];
  readonly englishLanguageAcquisitionStatusCode?: string;
  readonly individualEducationPlan: boolean;
  readonly limitedEnglishProficiency: boolean;
  readonly section504?: boolean;
  readonly migrantStatus?: boolean;

}
