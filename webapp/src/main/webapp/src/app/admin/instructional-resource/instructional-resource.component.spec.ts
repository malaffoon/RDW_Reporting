import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionalResourceComponent } from './instructional-resource.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { InstructionalResourceService } from './instructional-resource.service';
import { ReportingCommonModule } from '../../shared/reporting-common.module';
import { of } from 'rxjs';
import Spy = jasmine.Spy;
import { TranslateModule } from '@ngx-translate/core';

describe('InstructionalResourceComponent', () => {
  let component: InstructionalResourceComponent;
  let fixture: ComponentFixture<InstructionalResourceComponent>;
  let modalService: BsModalService;
  let resourceService: InstructionalResourceService;

  beforeEach(async(() => {
    modalService = jasmine.createSpyObj('BsModalService', ['show']);
    resourceService = jasmine.createSpyObj('InstructionalResourceService', [
      'findAll'
    ]);
    let findAll: Spy = resourceService.findAll as Spy;
    findAll.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [InstructionalResourceComponent],
      imports: [ReportingCommonModule, TranslateModule.forRoot(), FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BsModalService, useValue: modalService },
        { provide: InstructionalResourceService, useValue: resourceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionalResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
