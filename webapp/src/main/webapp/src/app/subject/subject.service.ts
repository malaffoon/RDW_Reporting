import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SubjectService {

  getSubjectCodes(): Observable<string[]> {
    return of([ 'Math', 'ELA' ]);
  }

}
