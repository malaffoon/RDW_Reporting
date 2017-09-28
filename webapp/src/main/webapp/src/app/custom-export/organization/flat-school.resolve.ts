import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { FlatSchool } from "./flat-school";
import { Observable } from "rxjs/Observable";
import { OrganizationService } from "./organization.service";

@Injectable()
export class FlatSchoolResolve implements Resolve<FlatSchool[]> {

  constructor(private service: OrganizationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FlatSchool[]> {
    return this.service.getSchoolsWithAncestry();
  }

}
