/**
 * This model represents a menu action.
 */
export class PopupMenuAction {
  public isDisabled: (rowITem: any) => boolean = () => false;
  public tooltip: (rowItem: any) => string = () => '';
  public displayName: (rowItem: any) => string;
  public perform: (rowItem: any) => void;
}
