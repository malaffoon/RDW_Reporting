import { Component, OnInit } from "@angular/core";
import { Option } from "../shared/form/search-select";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";
import { Tree } from "./organization/tree";
import { Organization } from "./organization/organization";
import { OrganizationMapper } from "./organization/organization.mapper";
import { ActivatedRoute } from "@angular/router";
import { UserOrganizations } from "./organization/user-organizations";
import { ExamFilterOptionsService } from "../assessments/filters/exam-filters/exam-filter-options.service";
import { isUndefined } from "util";
import { CustomExportRequest, CustomExportService } from "./custom-export.service";

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
   * Available filter options
   */
  private _schoolYears: number[];

  /**
   * Currently selected school year
   */
  private _schoolYear: number;

  /**
   * The sort order of the organizations
   */
  private _comparator = (a: Organization, b: Organization) => a.name && b.name ? a.name.localeCompare(b.name) : 0;

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private service: CustomExportService,
              private mapper: OrganizationMapper,
              private filterOptionService: ExamFilterOptionsService) {
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

    this.filterOptionService.getExamFilterOptions()
      .subscribe(options => {
        this._schoolYears = options.schoolYears;
        if (this._schoolYears.length) {
          this._schoolYear = this._schoolYears[0];
        }
      });
  }

  get selected(): Organization[] {
    return this._selected;
  }

  set selected(value: Organization[]) {
    if (this._selected !== value) {

      this._selected = value;

      this._unselected = this._organizations.schools
        .filter(organization => !value.some(x => x.id === organization.id));

      // restrict allowed additions to one district maximum
      let districtRestrictedUnselectedOrganizations = this._selected.length == 0
        ? this._unselected
        : this._unselected.filter(x => x.districtId === this._selected[ 0 ].districtId);

      // recompute the options available in the search select
      this._options = this.mapper
        .options(districtRestrictedUnselectedOrganizations, this._optionsByUuid);

      // recompute the organizations in the tree
      this._tree = this.mapper
        .organizationTreeWithPlaceholders(value, this._organizations)
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

  get schoolYears(): number[] {
    return this._schoolYears;
  }

  get schoolYear(): number {
    return this._schoolYear;
  }

  set schoolYear(value: number) {
    this._schoolYear = value;
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

  submit(): void {
    let request = this.createExportRequest(this._schoolYear, this._selected, this._organizations);
    this.service.createExport(request);
  }

  private createExportRequest(schoolYear: number, schools: Organization[], organizations: UserOrganizations): CustomExportRequest {

    // creates export request with organization type buckets for use in later processing
    let request = {
      schoolYear: schoolYear,
      districts: [],
      schoolGroups: [],
      schools: []
    };

    // all school IDs selected by the user
    let selectedSchoolIds = new Set<number>(schools.map(school => school.id));

    // organizational hierarchy of all organizations entitled to the user
    let organizationTree = this.mapper.organizationTree(organizations);

    // groups organization by type
    let groupOrganizationByType = (organization: Organization) => {
      switch (organization.type) {
        case OrganizationType.District:
          request.districts.push(organization.id);
          break;
        case OrganizationType.SchoolGroup:
          request.schoolGroups.push(organization.id);
          break;
        case OrganizationType.School:
          request.schools.push(organization.id);
          break;
      }
    };

    // recursively checks if all descendants are selected
    let allDescendantsSelected = (node: Tree<Organization>, selectedSchoolIds: Set<number>): boolean => {
      if (node.value.type === OrganizationType.School) {
        return selectedSchoolIds.has(node.value.id);
      }
      return node.children.every(child => allDescendantsSelected(child, selectedSchoolIds));
    };

    // conditionally adds organization to grouped organizations if all of its descendants are selected
    // if all of the node's descendants are selected it does not continue recursively checking descendants
    let groupIfAllDescendantsAreSelected = (node: Tree<Organization>) => {
      if (allDescendantsSelected(node, selectedSchoolIds)) {
        groupOrganizationByType(node.value);
      } else {
        node.children.forEach(groupIfAllDescendantsAreSelected);
      }
    };

    // starts the recursive grouping of organizations by type
    organizationTree.children.forEach(groupIfAllDescendantsAreSelected);

    return request;
  }

}
