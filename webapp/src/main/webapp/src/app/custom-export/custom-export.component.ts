import { Component, OnInit } from "@angular/core";
import { Option } from "../shared/form/search-select";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization";
import { OrganizationMapper } from "./organization/organization.mapper";
import { ActivatedRoute } from "@angular/router";
import { UserOrganizations } from "./organization/user-organizations";

@Component({
  selector: 'custom-export',
  templateUrl: './custom-export.component.html'
})
export class CustomExportComponent implements OnInit {

  /**
   * All organizations
   */
  private _organizations: UserOrganizations;

  /**
   * All selected organizations
   */
  private _selected: Organization[];

  /**
   * All unselected organizations
   */
  private _unselected: Organization[];

  /**
   * Options by UUID. This collection is used so that the option models can be created once and reused as needed.
   */
  private _optionsByUuid: Map<string, Option>;

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
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name) : 0;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private mapper: OrganizationMapper) {
  }

  ngOnInit() {
    this._organizations = this.route.snapshot.data[ 'organizations' ];

    // pre-sorted so mapper.option() results don't need to be sorted
    this._organizations.schools.sort(this._comparator);

    // create all options and reuse them when calling mapper.option()
    this._optionsByUuid = new Map<string, Option>(
      this._organizations.organizations.map(organization => <any>[
          organization.uuid,
          {
            label: organization.name,
            group: this.translate.instant(`labels.custom-export.form.organization.type.${OrganizationType[ organization.type ]}`),
            value: organization
          }
        ]
      )
    );

    this.selected = [];
  }

  get selected(): Organization[] {
    return this._selected;
  }

  set selected(value: Organization[]) {
    if (this._selected !== value) {

      this._selected = value;

      this._unselected = this._organizations.schools
        .filter(organization => !value.some(x => x.id === organization.id));

      console.log('un', this._unselected)

      // let addDisabled = this._selected.length > 1
      //   && this._selected.some(x => x.districtId !== this._selected[0].districtId);

      // restrict allowed additions to one district maximum
      let districtRestrictedUnselectedOrganizations = this._selected.length == 0
        ? this._unselected
        : this._unselected.filter(x => x.districtId === this._selected[0].districtId);

      // recompute the options available in the search select
      this._options = this.mapper
        .options(districtRestrictedUnselectedOrganizations, this._optionsByUuid);

      // recompute the organizations in the tree
      this._tree = this.mapper
        .organizationTree(value, this._organizations)
        .sort(this._comparator);
    }
  }

  get selectedAll(): boolean {
    return this._organizations.schools.length === this._selected.length;
  }

  get options(): Option[] {
    return this._options;
  }

  get tree(): Tree<Organization> {
    return this._tree;
  }

  get selectAllDisabled(): boolean {
    return this._organizations.districts.length < 2;
  }

  add(organization: Organization): void {
    this.selected = [
      ...this.selected,
      ...this._unselected.filter(unselected => organization.isOrIsAncestorOf(unselected))
    ];
  }

  addAll(): void {
    this.selected = this._organizations.schools;
  }

  remove(organization: Organization): void {
    this.selected = this.selected.filter(selected => !organization.isOrIsAncestorOf(selected));
  }

  removeAll(): void {
    this.selected = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

}
