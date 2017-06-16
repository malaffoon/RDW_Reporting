import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolGradeComponent } from "./school-grade.component";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ModalModule, TypeaheadModule } from "ngx-bootstrap";
import { CommonModule } from "../shared/common.module";

describe('SchoolGradeComponent', () => {
  let component: SchoolGradeComponent;
  let fixture: ComponentFixture<SchoolGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ModalModule.forRoot(),
        TypeaheadModule
      ],
      declarations: [ SchoolGradeComponent ]
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
