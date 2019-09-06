import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from './store';

export abstract class AbstractStore<T> implements Store<T> {
  private _behaviorSubject: BehaviorSubject<T>;
  private _observable: Observable<T>;

  protected constructor(initialState?: T) {
    this._behaviorSubject = new BehaviorSubject(initialState);
    this._observable = this._behaviorSubject.asObservable();
  }

  get state(): T {
    return this._behaviorSubject.getValue();
  }

  getState(): Observable<T> {
    return this._observable;
  }

  setState(nextState: T): void {
    this._behaviorSubject.next(nextState);
  }
}
