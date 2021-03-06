import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class StudentResultsFilterService {
  filterChange = new Subject();

  filterChanged(): void {
    this.filterChange.next();
  }
}
