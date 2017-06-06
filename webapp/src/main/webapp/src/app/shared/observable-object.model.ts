import { Observable, Observer } from "rxjs";

export class ObservableObject {
  get onChanges(): Observable<any> {
    return this._onChanges;
  }

  private _onChanges : Observable<any>;
  private onChangesObserver : Observer<string>;
  private oldObject : any = {};

  constructor() {
    this._onChanges = new Observable<any>(observer => this.onChangesObserver = observer).share();
    Object.assign(this.oldObject, this);
  }

  protected notifyChange(property){
    if(this[property] !== this.oldObject[property]){
      this.onChangesObserver.next(property);
      this.oldObject[property] = this[property];
    }
  }
}
