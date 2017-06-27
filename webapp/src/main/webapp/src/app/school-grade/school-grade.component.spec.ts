import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolGradeComponent } from "./school-grade.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "../shared/common.module";
import { SchoolService } from "./school.service";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { SharedModule } from "primeng/components/common/shared";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataService } from "../shared/data/data.service";
import { Observable } from "rxjs";
import { RequestOptionsArgs } from "@angular/http";

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        DropdownModule,
        SharedModule
      ],
      declarations: [ SchoolGradeComponent ],
      providers: [
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
