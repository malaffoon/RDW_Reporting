import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHistoryComponent } from './import-history.component';
import { ActivatedRoute } from '@angular/router';
import { ReportingCommonModule } from '../../../../shared/reporting-common.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ImportHistoryComponent', () => {
  let component: ImportHistoryComponent;
  let fixture: ComponentFixture<ImportHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportHistoryComponent],
      imports: [ReportingCommonModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { imports: [] } } }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
