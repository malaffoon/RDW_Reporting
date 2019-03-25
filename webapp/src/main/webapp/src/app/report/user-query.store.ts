import { AbstractStore } from '../shared/store/abstract-store';
import { UserQuery } from './report';
import { Injectable } from '@angular/core';

@Injectable()
export class UserQueryStore extends AbstractStore<UserQuery[]> {
  constructor() {
    super([]);
  }
}
