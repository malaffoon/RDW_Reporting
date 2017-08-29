import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolGradeComponent } from "./school-grade.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "../shared/common.module";
import { SchoolService } from "./school.service";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs";
import { RequestOptionsArgs } from "@angular/http";
import { AssessmentsModule } from "../assessments/assessments.module";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SchoolSelectComponent } from "./school-select/school-select.component";
import { TypeaheadModule } from "ngx-bootstrap";

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AssessmentsModule,
        RouterModule.forRoot([]),
        DropdownModule,
        TypeaheadModule,
        SharedModule
      ],
      declarations: [ SchoolGradeComponent, SchoolSelectComponent ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        SchoolService, {
          provide: DataService,
          useClass: MockDataService
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


class MockDataService {
  get(url, options?: RequestOptionsArgs): Observable<any> {
    return Observable.of([]);
  }
}
