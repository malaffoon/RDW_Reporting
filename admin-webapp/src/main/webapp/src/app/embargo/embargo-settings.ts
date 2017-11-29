export interface EmbargoSettings {

  /**
   * State-level embargo setting for current year
   */
  readonly stateEmbargo?: Embargo;

  /**
   * District-level embargo settings for current year
   */
  readonly districtEmbargoes?: Embargo[];

}

export interface Embargo {
  readonly individualEmbargoed: boolean;
  readonly aggregateEmbargoed: boolean;
  readonly organization: Organization;
  readonly examCountsBySubject: {[key: string]: number };
}

export interface Organization {
  readonly id: number;
  readonly name: string;
}
