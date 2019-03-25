import { AbstractStore } from '../shared/store/abstract-store';
import { UserReport } from './report';
import { Injectable } from '@angular/core';

@Injectable()
export class UserReportStore extends AbstractStore<UserReport[]> {
  constructor() {
    super([]);
  }
}
