import { Injectable } from "@angular/core";
import { DataService } from "../shared/data/data.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { byString } from "@kourge/ordering/comparator";
import { ordering } from "@kourge/ordering";

@Injectable()
export class GroupsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getGroups().toPromise()
      .then( groups => {
        return groups.sort(ordering(byString).on<any>(group => group.name).compare);
      });
  }

  constructor(private service: DataService) {
  }
}
