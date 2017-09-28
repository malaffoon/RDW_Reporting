import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";
import { School } from "../user/model/school.model";
import { User } from "../user/model/user.model";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

@Injectable()
export class OrganizationService {
  private schoolsWithDistricts: School[] = null;
  private schoolsLoaded: boolean = false;

  constructor(private userService: UserService, private dataService: DataService) {
  }

  getSchoolsWithDistricts(): Observable<School[]> {
    if (this.schoolsLoaded && this.schoolsWithDistricts != null) {
      return Observable.of(this.schoolsWithDistricts);
    }

    let schoolObserver: Observer<School[]>;
    let observable = new Observable<School[]>(observer=> schoolObserver = observer);

    Observable
      .forkJoin(this.userService.getCurrentUser(), this.getDistricts())
      .subscribe(response => {
        let user: User = response[ 0 ];
        let districts =response[ 1 ];

        let schools = user.schools
          .map(school => {
            school.districtName = districts.get(school.districtId);
            return school;
          });

        this.schoolsLoaded = true;
        this.schoolsWithDistricts = schools;

        schoolObserver.next(schools);
        schoolObserver.complete();
      });

    return observable;
  }

  getDistricts() {
    return this.dataService
      .get("/organizations/districts")
      .map(apiModels => new Map<number,string>(apiModels.map(x => [x.id, x.name])));
  }
}
