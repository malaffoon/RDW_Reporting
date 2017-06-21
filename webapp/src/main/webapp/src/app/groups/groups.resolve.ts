import { Injectable } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { byString } from "@kourge/ordering/comparator";

@Injectable()
export class GroupsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getGroups().toPromise()
      .then( groups => {
        return groups.sort((group1, group2) => byString(group1.name, group2.name));
      });
  }

  constructor(private service: DataService) {
  }
}
