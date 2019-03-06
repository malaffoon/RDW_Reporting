import { Observable } from 'rxjs';

/**
 * The store signature
 * This is used any time there is a resource shared between multiple views within the same page
 */
export interface Store<T> {
  readonly state: T;
  getState(): Observable<T>;
  setState(value: T): void;
}
