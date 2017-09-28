import { Component, OnInit, ViewChild } from "@angular/core";
import { Option } from "./searchable-select";
import { OrganizationService } from "./organization/organization.service";
import { ActivatedRoute } from "@angular/router";
import { OrganizationMapper } from "./organization/organization.mapper";
import { OrganizationType } from "./organization/organization-type.enum";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'custom-export',
  templateUrl: './custom-export.component.html'
})
export class CustomExportComponent implements OnInit {

  private _schoolOrganizations: any[];
  private _unselected: any[];
  private _selected: any[];
  private _options: Option[];

  constructor(private route: ActivatedRoute,
              private translate: TranslateService,
              private organizationService: OrganizationService,
              private organizationMapper: OrganizationMapper) {
  }

  ngOnInit() {
    this._schoolOrganizations = this.organizationService.getOrganizations(this.route.snapshot.data[ 'user' ].schools);
    this.selected = [];
  }

  get options(): any[] {
    return this._options;
  }

  get selected(): any[] {
    return this._selected;
  }

  set selected(value: any[]) {
    if (this._selected !== value) {

      this._selected = value.concat();

      this._unselected = this._schoolOrganizations
        .filter(organization => !value.some(x => x.id === organization.id));

      this._options = this.organizationMapper
        .getOrganizations(this._unselected)
        .map(organization => <Option>{
          label: organization.name,
          group: this.translate.instant(`labels.custom-export.form.organization.type.${OrganizationType[ organization.type ]}`),
          value: organization
        });
    }
  }

  get selectedAll(): boolean {
    return this._schoolOrganizations.length === this._selected.length;
  }

  add(value: any): void {
    this.selected = [
      ...this.selected,
      ...this._unselected.filter(organization => value.has(organization))
    ];
  }

  addAll(): void {
    this.selected = this._schoolOrganizations;
  }

  remove(value: any): void {
    this.selected = this.selected.filter(organization => !value.has(organization));
  }

  removeAll(): void {
    this.selected = [];
  }

  toggleSelectAll(): void {
    this.selectedAll ? this.removeAll() : this.addAll();
  }

}
