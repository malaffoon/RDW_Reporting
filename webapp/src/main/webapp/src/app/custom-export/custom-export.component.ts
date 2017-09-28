import { Component, OnInit } from "@angular/core";
import { Option } from "../shared/form/search-select";
import { OrganizationService } from "./organization/organization.service";
import { ActivatedRoute } from "@angular/router";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization";
import { OrganizationMapper } from "./organization/organization.mapper";
import { FlatSchool } from "./organization/flat-school";

@Component({
  selector: 'custom-export',
  templateUrl: './custom-export.component.html'
})
export class CustomExportComponent implements OnInit {

  /**
   * All organizations
   */
  private _schools: FlatSchool[];

  /**
   * All selected organizations
   */
  private _selected: FlatSchool[];

  /**
   * All unselected organizations
   */
  private _unselected: FlatSchool[];

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
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name): 0;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private service: OrganizationService,
              private mapper: OrganizationMapper) {
  }

  ngOnInit() {
    this._schools = this.service.getSchoolsWithAncestry(this.route.snapshot.data[ 'user' ].schools);
    this.selected = [];
  }

  get selected(): FlatSchool[] {
    return this._selected;
  }


  set selected(value: FlatSchool[]) {
    if (this._selected !== value) {

      this._selected = value.concat();

      this._unselected = this._schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // recompute the options available in the search select
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

  get options(): Option[] {
    return this._options;
  }

  get tree(): Tree<Organization> {
    return this._tree;
  }

  add(value: Organization): void {
    this.selected = [
      ...this.selected,
      ...this._unselected.filter(flatSchool => value.isOrIsAncestorOf(flatSchool))
    ];
  }

  addAll(): void {
    this.selected = this._schools;
  }

  remove(value: Organization): void {
    this.selected = this.selected.filter(flatSchool => !value.isOrIsAncestorOf(flatSchool));
  }

  removeAll(): void {
    this.selected = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

}
