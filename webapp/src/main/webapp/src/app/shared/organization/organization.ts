export interface Organization {
  readonly name: string;
  readonly type: OrganizationType;
}

interface IdentifiableOrganization extends Organization {
  readonly id: number;
  readonly naturalId?: string;
}

class DefaultOrganization {
  name: string;
}

class DefaultIdentifiableOrganization extends DefaultOrganization {
  id: number;
  naturalId: string;
}

export enum OrganizationType {
  State = 'State',
  DistrictGroup = 'DistrictGroup',
  District = 'District',
  SchoolGroup = 'SchoolGroup',
  School = 'School'
}

export interface State extends Organization {
}

export interface DistrictGroup extends IdentifiableOrganization {
}

export interface District extends IdentifiableOrganization {
  readonly districtGroupId?: number;
}

export interface SchoolGroup extends IdentifiableOrganization {
  readonly districtId?: number;
  readonly districtGroupId?: number;
}

export interface School extends IdentifiableOrganization {
  readonly schoolGroupId?: number;
  readonly districtId?: number;
  readonly districtGroupId?: number;
}

export class DefaultState extends DefaultOrganization implements State {
  get type(): OrganizationType {
    return OrganizationType.State;
  }
}

export class DefaultDistrictGroup extends DefaultIdentifiableOrganization implements DistrictGroup {
  get type(): OrganizationType {
    return OrganizationType.DistrictGroup;
  }
}

export class DefaultDistrict extends DefaultIdentifiableOrganization implements District {
  districtGroupId: number;
  get type(): OrganizationType {
    return OrganizationType.District;
  }
}

export class DefaultSchoolGroup extends DefaultIdentifiableOrganization implements SchoolGroup {
  districtId: number;
  districtGroupId: number;
  get type(): OrganizationType {
    return OrganizationType.SchoolGroup;
  }
}

export class DefaultSchool extends DefaultIdentifiableOrganization implements School {
  schoolGroupId: number;
  districtId: number;
  districtGroupId: number;
  get type(): OrganizationType {
    return OrganizationType.School;
  }
}
