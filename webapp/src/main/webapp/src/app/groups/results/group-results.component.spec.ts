import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { RequestOptionsArgs } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { AssessmentsModule } from "../../assessments/assessments.module";
import { CommonModule } from "../../shared/common.module";
import { DataService } from "../../shared/data/data.service";
import { User } from "../../user/model/user.model";
import { ExamFilterOptions } from "../../assessments/model/exam-filter-options.model";
import { ExamFilterOptionsService } from "../../assessments/filters/exam-filters/exam-filter-options.service";
import { Angulartics2Module, Angulartics2 } from "angulartics2";
import { PopoverModule } from "ngx-popover";
import { CsvExportService } from "../../csv-export/csv-export.service";
import { UserService } from "../../user/user.service";
import { MockUserService } from "../../../test/mock.user.service";
import { ReportModule } from "../../report/report.module";
import { MockActivatedRoute } from "../../../test/mock.activated-route";
import { GroupResultsComponent } from "./group-results.component";
import { GroupAssessmentService } from "./group-assessment.service";

let availableGrades = [];

describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;
  let exportService: any;
  let route: MockActivatedRoute;

  beforeEach(async(() => {
    let user = new User();
    user.groups = [ { name: "Group 1", id: 2, schoolName: '', subjectId: [ 'ELA' ] } ];

    let mockRouteSnapshot: any = {};
    mockRouteSnapshot.data = { user: user };
    mockRouteSnapshot.params = { groupId: 2 };

    route = new MockActivatedRoute();
    route.snapshotResult.and.returnValue(mockRouteSnapshot);

    let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

    availableGrades = [];
    exportService = {};

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AssessmentsModule,
        DropdownModule,
        SharedModule,
        Angulartics2Module,
        PopoverModule,
        ReportModule
      ],
      declarations: [ GroupResultsComponent ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Router, useClass: MockRouter },
        GroupAssessmentService,
        { provide: DataService, useClass: MockDataService },
        { provide: ExamFilterOptionsService, useClass: MockExamFilterOptionService },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: CsvExportService, useValue: exportService },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init if current group is null', () => {
    route.snapshot.params[ "groupId" ] = 2342;

    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

});

class MockDataService {
  get(url, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of({});
  }
}

class MockRouter {
  navigate(params: any[]) {
    return Observable.empty().toPromise();
  }
}

class MockExamFilterOptionService {
  getExamFilterOptions() {
    return Observable.of(new ExamFilterOptions());
  }
}
