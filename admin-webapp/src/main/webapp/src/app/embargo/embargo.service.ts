import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Embargo, EmbargoScope, OrganizationType } from "./embargo";
import { isUndefined } from "util";
import { HttpClient } from "@angular/common/http";

const ResourceContext = '/api/embargoes';

@Injectable()
export class EmbargoService {

  constructor(private http: HttpClient) {
  }

  getEmbargoesByOrganizationType(): Observable<Map<OrganizationType, Embargo[]>> {
    return this.http.get(`${ResourceContext}`)
      .map((sourceEmbargoes: any[]) => {
        return sourceEmbargoes.reduce((embargoesByOrganizationType, sourceEmbargo) => {
          const embargo = this.toEmbargo(sourceEmbargo),
            type = embargo.organization.type;

          embargoesByOrganizationType.set(type, (embargoesByOrganizationType.get(type) || []).concat(embargo));
          return embargoesByOrganizationType;
        }, new Map());
      });
  }

  update(embargo: Embargo, scope: EmbargoScope, value: boolean): Observable<Object> {
    return this.http.put(
      `${ResourceContext}/${embargo.organization.type}/${embargo.organization.id ? embargo.organization.id : -1}/${scope}`,
      String(value),
      { responseType: 'text' }
    );
  }

  /**
   * Coerces undefined individual and aggregate embargo state to "true" (embargoed)
   * Assumes state embargo does not carry undefined state
   *
   * @param source
   * @returns {Embargo}
   */
  private toEmbargo(source: any): Embargo {
    return {
      organization: {
        id: source.organizationId,
        name: source.organizationName,
        type: source.organizationType
      },
      schoolYear: source.schoolYear,
      readonly: source.readOnly,
      examCountsBySubject: source.examCounts,
      individualEnabled: isUndefined(source.individualEnabled) ? true : source.individualEnabled,
      aggregateEnabled: isUndefined(source.aggregateEnabled) ? true : source.aggregateEnabled
    };
  }

}
