import {Injectable} from "@angular/core";
import {DataService} from "../shared/data.service";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class GroupExamItemResolve implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    let groupId = route.parent.params['groupId'];
    let examId = route.params['examId'];
    let itemId = route.params['itemId'];
    let score = route.params['score'];

    return score == null
        ? this.service.getGroupExamItem(groupId, examId, itemId)
        : this.service.getGroupExamItemWithScore(groupId, examId, itemId, score);
  }

  constructor(private service: DataService) {
  }
}
