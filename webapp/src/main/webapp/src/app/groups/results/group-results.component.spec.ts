import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupResultsComponent } from "./group-results.component";
import { Observable } from "rxjs";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { AppModule } from "../../app.module";
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { CachingDataService } from "../../shared/cachingData.service";
import { ExamFilterOptionsService } from "./exam-filters/exam-filter-options.service";
import { ExamFilterOptions } from "./model/exam-filter-options.model";

describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;
  let mockRouteSnapshot;

  beforeEach(async(() => {
    mockRouteSnapshot = getRouteSnapshot();
    TestBed.configureTestingModule({
      imports: [ HttpModule, FormsModule, AppModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' }, {
        provide: ActivatedRoute,
        useValue: { snapshot: mockRouteSnapshot }
      }, {
        provide: ExamFilterOptionsService,
        useClass: MockExamFilterOptionsService
      } ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to current year if no school year is set', () => {
    let params = {};
    let actual = component.mapParamsToSchoolYear(params);

    expect(actual).toBe(2009);
  });

  it('should map schoolyear to filterBy object', () => {
    let params = { schoolYear: 2005 };

    let actual = component.mapParamsToSchoolYear(params);

    expect(actual).toBe(2005);
  });
});


function getRouteSnapshot() {
  return {
    data: {
      groups: [
        {
          id: 2,
          name: "Anderson's 4th grade."
        }
      ],
      assessments: [ {
        name: "Measurements & Data"
      } ]
    },
    params: {
      groupId: 2
    }
  };
}

class MockExamFilterOptionsService {
  public getExamFilterOptions() {

    let result = new ExamFilterOptions();
    result.schoolYears = [ 2009, 2008, 2007, 2006, 2005 ];
    result.ethnicities = [ "AmericanIndianOrAlaskaNative", "Asian", "BlackOrAfricanAmerican" ];

    return Observable.of(result);
  }
}

