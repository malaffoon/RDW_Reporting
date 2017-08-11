import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupsComponent } from "./groups.component";
import { CommonModule } from "../shared/common.module";
import { ActivatedRoute } from "@angular/router";
import { GroupFilterOptions } from "./model/group-filter-options.model";
import { GroupsModule } from "./groups.module";
import { School } from "./model/school.model";
import { GroupService } from "./groups.service";
import { Observable } from "rxjs";

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let mockGroupService = {
    getGroups: function () {
      return Observable.of([])
    }
  };
  let filterOptions = new GroupFilterOptions();

  filterOptions.schoolYears = [ 2017 ];
  filterOptions.schools = [ new School() ];
  filterOptions.subjects = [ "ALL" ];

  let mockRouteSnapshot = {
    data: { filterOptions: filterOptions }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule, GroupsModule ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: mockRouteSnapshot }
        }, {
          provide: GroupService,
          useValue: mockGroupService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
