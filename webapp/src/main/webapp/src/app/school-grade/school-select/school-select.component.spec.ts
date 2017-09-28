import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SchoolSelectComponent } from "./school-select.component";
import { CommonModule } from "../../shared/common.module";
import { DropdownModule } from "primeng/components/dropdown/dropdown";
import { TypeaheadModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { OrganizationService } from "../organization.service";
import { UserModule } from "../../user/user.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe('SchoolSelectComponent', () => {
  let component: SchoolSelectComponent;
  let fixture: ComponentFixture<SchoolSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule, NoopAnimationsModule, DropdownModule, UserModule, TypeaheadModule.forRoot(), FormsModule ],
      providers: [ OrganizationService ],
      declarations: [ SchoolSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
