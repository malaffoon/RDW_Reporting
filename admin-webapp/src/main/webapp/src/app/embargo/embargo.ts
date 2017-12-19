export interface Embargo {

  organization: Organization;
  schoolYear: number;
  readonly: boolean;
  examCountsBySubject: { [key: string]: number };
  individualEnabled: boolean;
  aggregateEnabled: boolean;

}

export interface Organization {
  readonly id: number;
  readonly name: string;
  readonly type: string;
}

export enum OrganizationType {
  State = 'State',
  District = 'District'
}

export enum EmbargoScope {
  Individual = 'Individual',
  Aggregate = 'Aggregate'
}
