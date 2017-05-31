import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvFiltersComponent } from './adv-filters.component';
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { AppModule } from "../../../app.module";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

describe('AdvFiltersComponent', () => {
  let component: AdvFiltersComponent;
  let fixture: ComponentFixture<AdvFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, FormsModule, AppModule ],
      providers: [ { provide: APP_BASE_HREF, useValue: '/' } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
