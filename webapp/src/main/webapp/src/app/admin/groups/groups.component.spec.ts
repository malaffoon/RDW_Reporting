import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsComponent } from './groups.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GroupFilterOptions } from './model/group-filter-options.model';
import { School } from './model/school.model';
import { GroupService } from './groups.service';
import { of } from 'rxjs';
import { Group } from './model/group.model';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalService, ModalModule } from 'ngx-bootstrap';
import { SubjectService } from '../../subject/subject.service';
import { TranslateModule } from '@ngx-translate/core';

let mockFilterOptionsProvider = { options: new GroupFilterOptions() };

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let mockGroupService = {
    getFilterOptions() {
      return of(mockFilterOptionsProvider.options);
    },
    getGroups: function() {
      return of([]);
    }
  };
  let filterOptions: GroupFilterOptions;
  let mockActivatedRoute: any;
  let mockModalService: any;

  const mockSubjectService = jasmine.createSpyObj('SubjectService', [
    'getSubjectCodes'
  ]);
  mockSubjectService.getSubjectCodes.and.callFake(() => of(['Math']));

  beforeEach(async(() => {
    mockModalService = jasmine.createSpyObj('BsModalService', ['show']);
    mockModalService.onHidden = new EventEmitter();

    filterOptions = new GroupFilterOptions();

    filterOptions.schoolYears = [2017];
    filterOptions.schools = [new School()];

    mockFilterOptionsProvider.options = filterOptions;

    mockActivatedRoute = {
      snapshot: {},
      params: new EventEmitter()
    };

    TestBed.configureTestingModule({
      declarations: [GroupsComponent],
      imports: [
        ReportingCommonModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        ModalModule.forRoot()
      ],
      providers: [
        { provide: BsModalService, useValue: mockModalService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  function createComponent() {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should set query params', () => {
    let school = new School();
    school.id = 1;
    school.name = 'Test1';

    mockFilterOptionsProvider.options.schools = [school];

    createComponent();

    mockActivatedRoute.params.emit({
      schoolId: 1,
      subject: 'Math',
      schoolYear: 2017
    });

    fixture.detectChanges();
    expect(component.query.school).toBe(school);
    expect(component.query.subject).toBe('Math');
    expect(component.query.schoolYear).toBe(2017);
  });

  it('should default to first when no params are set', () => {
    createComponent();
    mockActivatedRoute.params.emit({});

    fixture.detectChanges();
    expect(component.query.school).toBe(filterOptions.schools[0]);
    expect(component.query.subject).toBe(filterOptions.subjects[0]);
    expect(component.query.schoolYear).toBe(filterOptions.schoolYears[0]);
  });

  it('should default to first when params are not found', () => {
    createComponent();
    mockActivatedRoute.params.emit({
      schoolId: -1,
      subject: 'INVALID_SUBJECT',
      schoolYear: 2099
    });

    fixture.detectChanges();
    expect(component.query.school).toBe(filterOptions.schools[0]);
    expect(component.query.subject).toBe(filterOptions.subjects[0]);
    expect(component.query.schoolYear).toBe(filterOptions.schoolYears[0]);
  });

  it('should filter groups on name', () => {
    createComponent();
    component.groups = [
      'Test2',
      'test3',
      'TEST1',
      'NotInResult1',
      'NotInResult2'
    ].map(x => {
      let group = new Group();
      group.name = x;
      return group;
    });

    component.searchTerm = 'test';
    component.updateFilteredGroups();
    expect(component.filteredGroups.length).toBe(3);
  });
});
