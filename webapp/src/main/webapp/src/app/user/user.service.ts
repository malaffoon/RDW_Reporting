import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { User } from "./user";
import { CachingDataService } from "../shared/data/caching-data.service";
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ReportingServiceRoute } from '../shared/service-route';

@Injectable()
export class UserService {

  constructor(private dataService: CachingDataService) {
  }

  getUser(): Observable<User> {
    return this.dataService.get(`${ReportingServiceRoute}/user`).pipe(
      map(serverUser => <User>{
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        permissions: serverUser.permissions
      }),
      publishReplay(1),
      refCount()
    )
  }

}
