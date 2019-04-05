/**
 * This model represents a menu action.
 */
import { Observable, of } from 'rxjs';

export class PopupMenuAction {
  public isDisabled: (rowItem: any) => boolean = () => false;
  public tooltip: (rowItem: any) => string = () => '';
  public displayName: (rowItem: any) => string;
  public perform: (rowItem: any) => void;
  public getSubActions: (rowItem: any) => Observable<PopupMenuAction[]> = () =>
    of([]);
}
