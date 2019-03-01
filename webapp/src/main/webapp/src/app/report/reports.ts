import { UserReport } from './report';

export function toUserReport(serverReport: any): UserReport {
  return {
    ...serverReport,
    metadata: serverReport.metadata || {}
  }
}
