import { Injectable } from '@angular/core';
import { DataService } from '../../shared/data/data.service';
import { ReportingServiceRoute } from '../../shared/service-route';
import { Student } from './student';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const ResourceRoute = `${ReportingServiceRoute}/students`;

export interface StudentSearch {
  schoolId?: number;
  groupId?: number;
  userGroupId?: number;
  nameOrSsid?: string;
}

/**
 * TODO move to API repository layer
 *
 * Converts javascript booleans into string boolean codes
 *
 * @param {boolean} value
 * @returns {string}
 */
function toBooleanCode(value?: boolean): string {
  if (value == null) {
    return 'undefined';
  }
  return value ? 'yes' : 'no';
}

@Injectable()
export class StudentService {
  constructor(private dataService: DataService) {}

  getStudents(search: StudentSearch): Observable<Student[]> {
    return this.dataService
      .get(ResourceRoute, {
        params: <any>search
      })
      .pipe(
        map(serverStudents =>
          serverStudents.map(serverStudent => ({
            id: serverStudent.id,
            ssid: serverStudent.ssid,
            firstName: serverStudent.firstName,
            lastName: serverStudent.lastName,
            gender: serverStudent.genderCode,
            economicDisadvantage: toBooleanCode(
              serverStudent.economicDisadvantage
            ),
            ethnicities: serverStudent.ethnicityCodes,
            englishLanguageAcquisitionStatus:
              serverStudent.englishLanguageAcquisitionStatusCode,
            individualEducationPlan: toBooleanCode(
              serverStudent.individualEducationPlan
            ),
            limitedEnglishProficiency: toBooleanCode(
              serverStudent.limitedEnglishProficiency
            ),
            section504: toBooleanCode(serverStudent.section504),
            migrantStatus: toBooleanCode(serverStudent.migrantStatus),
            languages: serverStudent.languageCode,
            militaryConnectedCodes: serverStudent.militaryConnectedCode
          }))
        )
      );
  }
}
