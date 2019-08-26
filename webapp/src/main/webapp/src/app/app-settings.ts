/**
 * Represents all of the reporting system settings
 */
export interface ApplicationSettings {
  readonly accessDeniedUrl: string;
  readonly analyticsTrackingId: string;
  readonly interpretiveGuideUrl: string;
  readonly irisVendorId: string;
  readonly minItemDataYear: number;
  readonly percentileDisplayEnabled: boolean;
  readonly reportLanguages: string[];
  readonly uiLanguages: string[];
  readonly userGuideUrl: string;
  readonly state: StateSettings;
  readonly studentFields: Map<StudentFieldType, StudentFieldPermissionLevel>;
  readonly targetReport: TargetReportSettings;
  readonly tenantAdministrationDisabled: boolean;
  readonly transferAccess: boolean;
  readonly schoolYear: number;
}

export type StudentFieldType =
  | 'EconomicDisadvantage'
  | 'EnglishLanguageAcquisitionStatus'
  | 'Ethnicity'
  | 'Gender'
  | 'IndividualEducationPlan'
  | 'LimitedEnglishProficiency'
  | 'MigrantStatus'
  | 'MilitaryStudentIdentifier'
  | 'PrimaryLanguage'
  | 'Section504';

export type StudentFieldPermissionLevel = 'Disabled' | 'Admin' | 'Enabled';

export interface StateSettings {
  readonly code: string;
  readonly name: string;
}

export interface TargetReportSettings {
  readonly insufficientDataCutoff: number;
  readonly minimumStudentCount: number;
}

export function toReportLanguages(values: string[]): string[] {
  return values.reduce(
    (languageCodes, languageCode) => {
      if (!languageCodes.includes(languageCode)) {
        languageCodes.push(languageCode);
      }
      return languageCodes;
    },
    ['en']
  );
}

export function toApplicationSettings(
  serverSettings: any
): ApplicationSettings {
  return {
    accessDeniedUrl: serverSettings.accessDeniedUrl,
    analyticsTrackingId: serverSettings.analyticsTrackingId,
    interpretiveGuideUrl: serverSettings.interpretiveGuideUrl,
    irisVendorId: serverSettings.irisVendorId,
    minItemDataYear: serverSettings.minItemDataYear,
    percentileDisplayEnabled: serverSettings.percentileDisplayEnabled,
    reportLanguages: toReportLanguages(serverSettings.reportLanguages),
    schoolYear: serverSettings.schoolYear,
    state: {
      code: serverSettings.state.code,
      name: serverSettings.state.name
    },
    studentFields: <any>new Map(Object.entries(serverSettings.studentFields)),
    targetReport: {
      insufficientDataCutoff:
        serverSettings.targetReport.insufficientDataCutoff,
      minimumStudentCount: serverSettings.targetReport.minNumberOfStudents
    },
    tenantAdministrationDisabled: serverSettings.tenantAdministrationDisabled,
    transferAccess: serverSettings.transferAccessEnabled,
    uiLanguages: serverSettings.uiLanguages,
    userGuideUrl: serverSettings.userGuideUrl
  };
}
