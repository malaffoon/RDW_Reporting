import { Organization } from '../shared/organization/organization';

export interface Sandbox {
  key: string;
  label: string;
  roles: SandboxRole[];
}

export type SandboxRoleType =
  | 'DistrictAdministrator'
  | 'SchoolAdministrator'
  | 'Teacher';

export interface SandboxRole {
  id: string;
  type: SandboxRoleType;
  organization?: Organization;
  gradeCode?: string;
}
