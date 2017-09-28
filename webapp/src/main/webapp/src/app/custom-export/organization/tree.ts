export class Tree<T> {

  private _value: any;
  private _children: Tree<T>[] = [];

  constructor(value?: any){
    this._value = value;
  }

  get value(): any {
    return this._value;
  }

  get children(): Tree<T>[] {
    return this._children.concat();
  }

  getOrCreate(matcher: (x:T) => boolean, value: T): Tree<T> {
    let existing = this.find(matcher);
    if (existing) {
      return existing;
    }
    let created = new Tree<T>(value);
    this.add(created);
    return created;
  }

  create(value: T): Tree<T> {
    let child = new Tree<T>(value);
    this.add(child);
    return child;
  }

  sort(comparator: (a: T, b: T) => number): Tree<T> {
    this._children.sort((a, b) => comparator(a.value, b.value));
    this._children.forEach(child => child.sort(comparator));
    return this;
  }

  find(matcher: (x:T) => boolean): Tree<T> {
    return this._children.find((child) => matcher(child.value))
  }

  add(tree: Tree<T>): void {
    this._children.push(tree);
  }

}
