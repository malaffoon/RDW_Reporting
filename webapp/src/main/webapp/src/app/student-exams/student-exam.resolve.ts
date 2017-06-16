import {Injectable} from "@angular/core";
import {DataService} from "../shared/data/data.service";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class StudentExamsResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this.service.getStudentExams(route.params['groupId'], route.params['studentId']);
  }

  constructor(private service: DataService) {
  }
}
