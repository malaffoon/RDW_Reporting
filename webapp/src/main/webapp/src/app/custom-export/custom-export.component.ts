import { Component, OnInit } from "@angular/core";
import { Option } from "./searchable-select";
import { OrganizationService } from "./organization/organization.service";
import { ActivatedRoute } from "@angular/router";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization.model";
import { OrganizationMapper } from "./organization/organization.mapper";

@Component({
  selector: 'custom-export',
  templateUrl: './custom-export.component.html'
})
export class CustomExportComponent implements OnInit {

  /**
   * All organizations
   */
  private _schools: any[];

  /**
   * All selected organizations
   */
  private _selected: any[];

  /**
   * All unselected organizations
   */
  private _unselected: any[];

  /**
   * Option view models computed from schools
   */
  private _options: Option[];

  /**
   * Organization view model computed from schools
   */
  private _tree: Tree<Organization>;

  /**
   * The sort order of the organizations
   */
  private _comparator: (a: Organization, b: Organization) => number =
    (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name): 0;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private service: OrganizationService,
              private mapper: OrganizationMapper) {
  }

  ngOnInit() {
    this._schools = this.service.getSchoolsWithAncestry(this.route.snapshot.data[ 'user' ].schools);
    this.selected = [];
  }

  get selected(): any[] {
    return this._selected;
  }


  set selected(value: any[]) {
    if (this._selected !== value) {

      this._selected = value.concat();

      this._unselected = this._schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // recompute the options available in the select/type-ahead
      this._options = this.mapper
        .organizations(this._unselected)
        .sort(this._comparator)
        .map(organization => <Option>{
          label: organization.name,
          group: this.translate.instant(`labels.custom-export.form.organization.type.${OrganizationType[ organization.type ]}`),
          value: organization
        });

      // recompute the organizations in the tree
      this._tree = this.mapper
        .organizationTree(value)
        .sort(this._comparator);
    }
  }

  get selectedAll(): boolean {
    return this._schools.length === this._selected.length;
  }

  get options(): any[] {
    return this._options;
  }

  get tree(): Tree<Organization> {
    return this._tree;
  }

  add(value: any): void {
    this.selected = [
      ...this.selected,
      ...this._unselected.filter(organization => value.isOrIsAncestorOf(organization))
    ];
  }

  addAll(): void {
    this.selected = this._schools;
  }

  remove(value: any): void {
    this.selected = this.selected.filter(organization => !value.isOrIsAncestorOf(organization));
  }

  removeAll(): void {
    this.selected = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

}
