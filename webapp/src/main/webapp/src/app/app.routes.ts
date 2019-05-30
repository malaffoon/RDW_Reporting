import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { GroupResultsComponent } from './groups/results/group-results.component';
import { GroupAssessmentResolve } from './groups/results/group-assessment.resolve';
import { SchoolAssessmentResolve } from './school-grade/results/school-assessments.resolve';
import { SchoolResultsComponent } from './school-grade/results/school-results.component';
import { CurrentSchoolResolve } from './school-grade/results/current-school.resolve';
import { StudentResultsComponent } from './student/results/student-results.component';
import { StudentExamHistoryResolve } from './student/results/student-exam-history.resolve';
import { StudentResponsesResolve } from './student/responses/student-responses.resolve';
import { StudentResponsesComponent } from './student/responses/student-responses.component';
import { TranslateResolve } from './translate.resolve';
import { StudentHistoryResponsesExamResolve } from './student/responses/student-history-responses-exam.resolve';
import { StudentHistoryResponsesAssessmentResolve } from './student/responses/student-history-responses-assessment.resolve';
import { StudentHistoryResponsesStudentResolve } from './student/responses/student-history-responses-student.resolve';
import { ReportsComponent } from './report/reports.component';
import { ErrorComponent } from './error/error.component';
import { AccessDeniedComponent } from './error/access-denied/access-denied.component';
import { OrganizationExportComponent } from './organization-export/organization-export.component';
import { InstructionalResourceComponent } from './admin/instructional-resource/instructional-resource.component';
import { EmbargoComponent } from './admin/embargo/embargo.component';
import { EmbargoResolve } from './admin/embargo/embargo.resolve';
import { ImportHistoryComponent } from './admin/groups/import/history/import-history.component';
import { FileFormatComponent } from './admin/groups/import/fileformat/file-format.component';
import { ImportHistoryResolve } from './admin/groups/import/history/import-history.resolve';
import { GroupImportComponent } from './admin/groups/import/group-import.component';
import { GroupImportDeactivateGuard } from './admin/groups/import/group-import.deactivate';
import { GroupsComponent } from './admin/groups/groups.component';
import { SessionExpiredComponent } from './shared/security/session-expired.component';
import { AuthorizationCanActivate } from './shared/security/authorization.can-activate';
import { RoutingAuthorizationCanActivate } from './shared/security/routing-authorization.can-activate';
import { AggregateReportComponent } from './aggregate-report/results/aggregate-report.component';
import { AggregateReportResolve } from './aggregate-report/results/aggregate-report.resolve';
import { AggregateReportOptionsResolve } from './aggregate-report/aggregate-report-options.resolve';
import { ReportQueryResolve } from './aggregate-report/report-query.resolve';
import { GroupDashboardComponent } from './dashboard/group-dashboard/group-dashboard.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserGroupResolve } from './user-group/user-group.resolve';
import { AggregateQueryFormContainerComponent } from './aggregate-report/query-forms/aggregate-query-form-container.component';
import { StudentPipe } from './shared/format/student.pipe';
import { ingestPipelineRoutes } from './admin/ingest-pipeline/ingest-pipeline.routes';
import { SandboxConfigurationComponent } from './admin/sandbox-tenants/pages/sandbox.component';
import { NewSandboxConfigurationComponent } from './admin/sandbox-tenants/pages/new-sandbox.component';
import { TenantConfigurationComponent } from './admin/sandbox-tenants/pages/tenant.component';
import { NewTenantConfigurationComponent } from './admin/sandbox-tenants/pages/new-tenant.component';

export const studentPipe = new StudentPipe();
export const adminRoute = {
  path: '',
  data: {
    permissions: [
      'CUSTOM_AGGREGATE_READ',
      'GROUP_WRITE',
      'INDIVIDUAL_PII_READ',
      'INSTRUCTIONAL_RESOURCE_WRITE',
      'EMBARGO_WRITE'
    ]
  },
  canActivate: [AuthorizationCanActivate],
  children: [
    {
      path: 'admin-groups',
      pathMatch: 'prefix',
      data: {
        breadcrumb: {
          translate: 'admin-groups.title'
        },
        permissions: ['GROUP_WRITE'],
        denyAccess: true
      },
      canActivate: [AuthorizationCanActivate],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: GroupsComponent
        },
        {
          path: 'import',
          data: {
            breadcrumb: { translate: 'group-import.title' }
          },
          children: [
            {
              path: '',
              pathMatch: 'prefix',
              component: GroupImportComponent,
              canDeactivate: [GroupImportDeactivateGuard]
            },
            {
              path: 'fileformat',
              pathMatch: 'prefix',
              data: {
                breadcrumb: { translate: 'file-format.header' }
              },
              children: [
                {
                  path: '',
                  pathMatch: 'prefix',
                  component: FileFormatComponent
                }
              ]
            }
          ]
        },
        {
          path: 'history',
          pathMatch: 'prefix',
          children: [
            {
              path: '',
              pathMatch: 'prefix',
              component: ImportHistoryComponent,
              resolve: { imports: ImportHistoryResolve },
              data: { breadcrumb: { translate: 'import-history.title' } }
            }
          ]
        }
      ]
    },
    ...ingestPipelineRoutes,
    {
      path: 'instructional-resource',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'instructional-resource.title' },
        permissions: ['INSTRUCTIONAL_RESOURCE_WRITE'],
        denyAccess: true
      },
      canActivate: [AuthorizationCanActivate],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: InstructionalResourceComponent
        }
      ]
    },
    {
      path: 'embargoes',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'embargo.title' },
        permissions: ['EMBARGO_WRITE']
      },
      canActivate: [AuthorizationCanActivate],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: EmbargoComponent,
          resolve: { embargoesByOrganizationType: EmbargoResolve }
        }
      ]
    },
    {
      path: 'sandboxes',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'sandbox-config.title' }
        //TODO: Uncomment the line below once the roles/permissions have been configured
        // permissions: ['TENANT_ADMIN']
      },
      canActivate: [AuthorizationCanActivate],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: SandboxConfigurationComponent
        },
        {
          path: 'new',
          pathMatch: 'prefix',
          data: {
            breadcrumb: { translate: 'sandbox-config.new-sandbox.header' }
          },
          children: [
            {
              path: '',
              pathMatch: 'prefix',
              component: NewSandboxConfigurationComponent
            }
          ]
        }
      ]
    },
    {
      path: 'tenants',
      pathMatch: 'prefix',
      data: {
        breadcrumb: { translate: 'tenant-config.title' }
        //TODO: Uncomment the line below once the roles/permissions have been configured
        // permissions: ['TENANT_ADMIN']
      },
      canActivate: [AuthorizationCanActivate],
      children: [
        {
          path: '',
          pathMatch: 'prefix',
          component: TenantConfigurationComponent
        },
        {
          path: 'new',
          pathMatch: 'prefix',
          data: {
            breadcrumb: { translate: 'tenant-config.new-tenant.header' }
          },
          children: [
            {
              path: '',
              pathMatch: 'prefix',
              component: NewTenantConfigurationComponent
            }
          ]
        }
      ]
    }
  ]
};

export const studentTestExamHistoryChildRoute = {
  path: 'exams/:examId',
  pathMatch: 'full',
  resolve: {
    assessment: StudentHistoryResponsesAssessmentResolve,
    assessmentItems: StudentResponsesResolve,
    exam: StudentHistoryResponsesExamResolve,
    student: StudentHistoryResponsesStudentResolve
  },
  data: {
    breadcrumb: {
      translate: 'student-responses.crumb'
    }
  },
  component: StudentResponsesComponent
};

export const studentTranslateParameters = student => ({
  value: studentPipe.transform(student)
});

export const studentTestHistoryChildRoute = {
  path: 'students/:studentId',
  resolve: { examHistory: StudentExamHistoryResolve },
  data: {
    breadcrumb: {
      translate: 'student-results.crumb',
      translateResolve: 'examHistory.student',
      translateParameters: studentTranslateParameters
    }
  },
  children: [
    {
      path: '',
      data: { canReuse: true },
      pathMatch: 'full',
      component: StudentResultsComponent
    },
    studentTestExamHistoryChildRoute
  ]
};

export const UserGroupRoutes = [
  {
    path: 'user-groups',
    data: {
      permissions: ['GROUP_PII_READ']
    },
    canActivate: [AuthorizationCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserGroupComponent,
        data: {
          breadcrumb: { translate: 'user-group.new-heading' }
        },
        resolve: {
          group: UserGroupResolve
        }
      },
      {
        path: ':groupId',
        pathMatch: 'full',
        component: UserGroupComponent,
        data: {
          breadcrumb: { resolve: 'group.name' }
        },
        resolve: {
          group: UserGroupResolve
        }
      }
    ]
  }
];

export const routes: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      },
      adminRoute,
      ...UserGroupRoutes,
      {
        path: 'group-exams',
        data: {
          breadcrumb: { translate: 'groups.heading' },
          permissions: ['GROUP_PII_READ']
        },
        canActivate: [AuthorizationCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            resolve: { assessment: GroupAssessmentResolve },
            component: GroupResultsComponent
          },
          studentTestHistoryChildRoute
        ]
      },
      {
        path: 'group-dashboard',
        data: {
          breadcrumb: { translate: 'group-dashboard.name' },
          permissions: ['GROUP_PII_READ']
        },
        canActivate: [AuthorizationCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            component: GroupDashboardComponent
          }
        ]
      },
      {
        path: 'schools/:schoolId',
        data: {
          breadcrumb: { resolve: 'school.name' },
          permissions: ['INDIVIDUAL_PII_READ']
        },
        resolve: { school: CurrentSchoolResolve },
        canActivate: [AuthorizationCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { canReuse: true },
            resolve: {
              assessment: SchoolAssessmentResolve,
              school: CurrentSchoolResolve
            },
            component: SchoolResultsComponent
          },
          studentTestHistoryChildRoute
        ]
      },
      studentTestHistoryChildRoute,
      {
        path: 'reports',
        pathMatch: 'full',
        data: {
          breadcrumb: { translate: 'reports.heading' },
          permissions: ['GROUP_PII_READ']
        },
        canActivate: [AuthorizationCanActivate],
        component: ReportsComponent
      },
      {
        path: 'aggregate-reports',
        data: {
          breadcrumb: { translate: 'aggregate-reports.heading' },
          permissions: ['CUSTOM_AGGREGATE_READ']
        },
        resolve: {
          options: AggregateReportOptionsResolve
        },
        canActivate: [AuthorizationCanActivate],
        children: [
          {
            path: '',
            pathMatch: 'full',
            resolve: {
              query: ReportQueryResolve
            },
            component: AggregateQueryFormContainerComponent
          },
          {
            path: ':id',
            pathMatch: 'full',
            data: {
              breadcrumb: { resolve: 'report.label' }
            },
            resolve: { report: AggregateReportResolve },
            component: AggregateReportComponent
          }
        ]
      },
      {
        path: 'custom-export',
        pathMatch: 'full',
        data: {
          breadcrumb: { translate: 'organization-export.title' },
          permissions: ['INDIVIDUAL_PII_READ']
        },
        canActivate: [AuthorizationCanActivate],
        component: OrganizationExportComponent
      },
      {
        path: 'session-expired',
        pathMatch: 'full',
        component: SessionExpiredComponent
      },
      {
        path: 'error',
        pathMatch: 'full',
        component: ErrorComponent
      }
    ].map(x => ({
      ...x,
      canActivate: [RoutingAuthorizationCanActivate],
      resolve: {
        translateComplete: TranslateResolve
      }
    }))
  },
  {
    path: 'access-denied',
    pathMatch: 'full',
    component: AccessDeniedComponent
  }
];
