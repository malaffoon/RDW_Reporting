export interface Organization {
  readonly id: number;
  readonly name: string;
  readonly type: OrganizationType;
}

export enum OrganizationType {
  State,
  District,
  School
}

export interface State extends Organization {
}

export interface District extends Organization {
}

export interface School extends Organization {
  readonly districtId: number;
}
