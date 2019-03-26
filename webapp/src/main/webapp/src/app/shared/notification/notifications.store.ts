import { Injectable } from '@angular/core';
import { AbstractStore } from '../store/abstract-store';
import { Notification } from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsStore extends AbstractStore<Notification[]> {
  constructor() {
    super([]);
  }
}
