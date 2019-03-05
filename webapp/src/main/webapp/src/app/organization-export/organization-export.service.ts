import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Organization } from './organization/organization';
import { UserOrganizations } from './organization/user-organizations';
import { OrganizationGroupingService } from './organization-grouping.service';
import { UserReportService } from '../report/user-report.service';
import { UserReport } from '../report/report';

@Injectable()
export class OrganizationExportService {

  constructor(private reportService: UserReportService,
              private groupingService: OrganizationGroupingService) {
  }

  /**
   * Submits a request to create a organization scoped exam CSV export.
   *
   * @param {OrganizationExport} orgExport The export request
   * @returns {Observable<void>}
   */
  createExport(orgExport: OrganizationExport): Observable<UserReport> {
    return this.reportService.createReport({
      type: 'DistrictSchoolExport',
      name: orgExport.name,
      schoolYear: orgExport.schoolYear,
      disableTransferAccess: orgExport.disableTransferAccess,
      ...this.groupingService.groupSelectedOrganizationIdsByType(orgExport.schools, orgExport.organizations)
    });
  }

}

export interface OrganizationExport {
  name?: string;
  schoolYear: number;
  disableTransferAccess: boolean;
  schools: Organization[];
  organizations: UserOrganizations;
}

