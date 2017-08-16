import { Component, OnInit } from "@angular/core";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "./groups.service";
import { GroupQuery } from "./model/group-query.model";
import { Group } from "./model/group.model";
import { UserService } from "../user/user.service";
import { DeleteGroupModalComponent } from "./delete-group.modal";
import { BsModalService, BsModalRef } from "ngx-bootstrap";

@Component({
  selector: 'groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit {
  filterOptions: GroupFilterOptions;
  groups: Group[];
  filteredGroups: Group[];
  query: GroupQuery;
  searchTerm: string = '';
  bsModalRef: BsModalRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: GroupService,
              private modalService: BsModalService,
              private userService: UserService ) {
  }

  ngOnInit() {
    this.filterOptions = this.route.snapshot.data[ "filterOptions" ];
    this.query = new GroupQuery(this.filterOptions.subjects);

    if(this.filterOptions.schools.length == 0)
      return;

    this.route.params.subscribe(p => {
      let params:any = p;

      this.query.school = this.filterOptions.schools.find(school => school.id == params.schoolId) || this.filterOptions.schools[ 0 ];

      this.query.schoolYear = +params.schoolYear || this.filterOptions.schoolYears[ 0 ];
      this.query.subject =  params.subject || this.filterOptions.subjects[ 0 ];

      this.updateResults();
    });
  }

  updateRoute() {
    let params = {
      schoolId: this.query.school.id,
      schoolYear: this.query.schoolYear,
      subject: this.query.subject
    };

    this.router.navigate([ params ], { relativeTo: this.route });
  }

  updateResults() {
    this.service
      .getGroups(this.query)
      .subscribe(groups => {
        this.groups = groups;
        this.filterGroups();
      })
  }

  filterGroups() {
    this.filteredGroups = this.groups.filter( x => x.name.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0)
  }

  openSetActiveModal(group: Group) {
    this.bsModalRef = this.modalService.show(DeleteGroupModalComponent);
    this.bsModalRef.content.group = group;
    this.modalService.onHide.subscribe(x => {
      this.updateResults();
    });
  }
}
