import { Injectable } from '@angular/core';
import { CachingDataService } from '../../../shared/data/caching-data.service';
import { State } from '../model/state';
import { Observable, of } from 'rxjs';
import { AdminServiceRoute } from '../../../shared/service-route';

const ResourceRoute = `${AdminServiceRoute}/states`;

@Injectable({
  providedIn: 'root'
})
export class StateOptionsService {
  constructor(private dataService: CachingDataService) {}

  public getStates(): Observable<State[]> {
    return this.dataService.get(ResourceRoute);

    // return of([
    //   {
    //     code: 'TS',
    //     name: 'Test State'
    //   },
    //   {
    //     code: 'CA',
    //     name: 'Cali'
    //   }
    // ]);
  }
}
