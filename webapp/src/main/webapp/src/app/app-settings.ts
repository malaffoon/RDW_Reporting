/**
 * Represents all of the reporting system settings
 */
export interface ApplicationSettings {
  readonly irisVendorId: string;
  readonly analyticsTrackingId: string;
  readonly interpretiveGuideUrl: string;
  readonly accessDeniedUrl: string;
  readonly userGuideUrl: string;
  readonly minItemDataYear: number;
  readonly reportLanguages: string[];
  readonly uiLanguages: string[];
  readonly transferAccess: boolean;
  readonly percentileDisplayEnabled: boolean;
  /** @deprecated use {@link ExamSearchFilterService} */
  readonly lepEnabled: boolean;
  /** @deprecated use {@link ExamSearchFilterService} */
  readonly elasEnabled: boolean;
  readonly targetReport: TargetReportSettings;
}

export interface TargetReportSettings {
  readonly insufficientDataCutoff: number;
  readonly minimumStudentCount: number;
}

export function toApplicationSettings(
  serverSettings: any
): ApplicationSettings {
  const accessDeniedUrl = serverSettings.accessDeniedUrl.startsWith('redirect:')
    ? serverSettings.accessDeniedUrl.substring(9)
    : undefined;

  return {
    accessDeniedUrl,
    analyticsTrackingId: serverSettings.analyticsTrackingId,
    elasEnabled: serverSettings.englishLanguageAcquisitionStatusEnabled,
    interpretiveGuideUrl: serverSettings.interpretiveGuideUrl,
    irisVendorId: serverSettings.irisVendorId,
    lepEnabled: serverSettings.limitedEnglishProficienciesEnabled,
    minItemDataYear: serverSettings.minItemDataYear,
    percentileDisplayEnabled: serverSettings.percentileDisplayEnabled,
    reportLanguages: serverSettings.effectiveReportLanguages,
    state: {
      code: serverSettings.state.code,
      name: serverSettings.state.name
    },
    targetReport: {
      insufficientDataCutoff:
        serverSettings.targetReport.insufficientDataCutoff,
      minimumStudentCount: serverSettings.targetReport.minNumberOfStudents
    },
    transferAccess: serverSettings.transferAccessEnabled,
    uiLanguages: serverSettings.uiLanguages,
    userGuideUrl: serverSettings.userGuideUrl
  };
}
