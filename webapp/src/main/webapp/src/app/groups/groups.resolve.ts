import { Injectable } from "@angular/core";
import { DataService } from "../shared/data.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class GroupsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getGroups();
  }

  constructor(private service: DataService) {
  }
}
