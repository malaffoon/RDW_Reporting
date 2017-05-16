import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupResultsComponent } from './group-results.component';
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { DataService } from "../../shared/data.service";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { SchoolYearPipe } from "../../shared/schoolYear.pipe";
import { AppModule } from "../../app.module";
import { Router, ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { StaticDataService } from "../../shared/staticData.service";

let mockRouteSnapshot = {
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

class MockStaticDataService extends StaticDataService {
  public getSchoolYears() {
    let result = [
      { id: 2006 },
      { id: 2007 },
      { id: 2008 },
      { id: 2009, isCurrent: true }
    ];

    return Observable.of(result);
  }
}


describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), HttpModule, FormsModule, TranslateModule.forRoot(), AppModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' }, {
        provide: ActivatedRoute,
        useValue: { snapshot: mockRouteSnapshot }
      }, {
        provide: StaticDataService,
        useClass: MockStaticDataService
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
});
