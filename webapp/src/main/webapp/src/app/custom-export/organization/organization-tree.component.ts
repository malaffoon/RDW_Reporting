import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Organization } from "./organization.model";
import { OrganizationMapper } from "./organization.mapper";

@Component({
  selector: 'organization-tree',
  templateUrl: './organization-tree.component.html'
})
export class OrganizationTreeComponent {

  @Output()
  select = new EventEmitter<Organization>();

  private _organizations: any[] = [];
  private _organizationTree: SortedTree<Organization>;
  private _comparator: (a: Organization, b: Organization) => number = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name): 0;

  constructor(private mapper: OrganizationMapper) {
  }

  get organizations(): any[] {
    return this._organizations;
  }

  @Input()
  set organizations(values: any[]) {
    if (this._organizations !== values) {
      this._organizations = values;
      this._organizationTree = this.createOrganizationTree(values).sort(this._comparator);
    }
  }

  get organizationTree(): SortedTree<Organization> {
    return this._organizationTree;
  }

  get comparator(): (a: Organization, b: Organization) => number {
    return this._comparator;
  }

  @Input()
  set comparator(value: (a: Organization, b: Organization) => number) {
    this._comparator = this.comparator;
    this._organizationTree.sort(this._comparator);
  }

  onClick(organization: Organization): void {
    this.select.emit(organization);
  }

  private createOrganizationTree(organizations: any[]): SortedTree<Organization> {
    let root = new SortedTree<Organization>();
    organizations.forEach(org => root
      .getOrCreate(x => x.id === org.districtGroupId, this.mapper.districtGroup(org))
      .getOrCreate(x => x.id === org.districtId, this.mapper.district(org))
      .getOrCreate(x => x.id === org.schoolGroupId, this.mapper.schoolGroup(org))
      .create(this.mapper.school(org))
    );
    return root;
  }

}

class SortedTree<T> {

  private _value: any;
  private _children: SortedTree<T>[] = [];

  constructor(value?: any){
    this._value = value;
  }

  get value(): any {
    return this._value;
  }

  get children(): SortedTree<T>[] {
    return this._children.concat();
  }

  getOrCreate(matcher: (x:T) => boolean, value: T): SortedTree<T> {
    let existing = this.find(matcher);
    if (existing) {
      return existing;
    }
    let created = new SortedTree<T>(value);
    this.add(created);
    return created;
  }

  create(value: T): SortedTree<T> {
    let child = new SortedTree<T>(value);
    this.add(child);
    return child;
  }

  sort(comparator: (a: T, b: T) => number): SortedTree<T> {
    this._children.sort((a, b) => comparator(a.value, b.value));
    this._children.forEach(child => child.sort(comparator));
    return this;
  }

  find(matcher: (x:T) => boolean): SortedTree<T> {
    return this._children.find((child) => matcher(child.value))
  }

  add(tree: SortedTree<T>): void {
    this._children.push(tree);
  }

}
