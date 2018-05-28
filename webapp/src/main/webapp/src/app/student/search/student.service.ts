import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { ReportingServiceRoute } from '../../shared/service-route';
import { Student } from './student';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

export interface StudentSearch {
  schoolId?: number;
  groupId?: number;
}


@Injectable()
export class StudentService {

  constructor(private dataService: DataService) {
  }

  getStudents(search: StudentSearch): Observable<Student[]> {
    return this.dataService.get(`${ReportingServiceRoute}/students`, {
      params: <any>search
    }).pipe(
      map(serverStudents => serverStudents.map(serverStudent => <Student>{
        id: serverStudent.id,
        ssid: serverStudent.ssid,
        firstName: serverStudent.firstName,
        lastName: serverStudent.lastName,
        genderCode: serverStudent.genderCode,
        ethnicityCodes: serverStudents.ethnicityCodes,
        englishLanguageAcquisitionStatusCode: serverStudent.englishLanguageAcquisitionStatusCode,
        individualEducationPlan: serverStudents.individualEducationPlan,
        limitedEnglishProficiency: serverStudents.limitedEnglishProficiency,
        section504: serverStudents.section504,
        migrantStatus: serverStudents.migrantStatus
      }))
    );
  }

}
