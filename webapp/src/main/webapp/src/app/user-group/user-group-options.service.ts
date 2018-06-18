import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserGroupOptions } from './user-group-options';
import { map } from 'rxjs/operators';
import { SubjectService } from '../subject/subject.service';


@Injectable()
export class UserGroupOptionsService {

  constructor(private subjectService: SubjectService) {
  }

  getOptions(): Observable<UserGroupOptions> {
    return this.subjectService.getSubjectCodes().pipe(
      map(serverOptions => <UserGroupOptions>{
        subjects: serverOptions.subjects
      })
    );
  }

}
