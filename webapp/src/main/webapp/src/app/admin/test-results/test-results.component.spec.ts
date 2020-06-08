import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsComponent } from './test-results.component';
import { BsModalService } from 'ngx-bootstrap';
import { TestResultsService } from './service/test-results.service';

describe('TestResultsComponent', () => {
  let modalService: BsModalService;
  let testResultsService: TestResultsService;
  let component: TestResultsComponent;
  let fixture: ComponentFixture<TestResultsComponent>;

  beforeEach(async(() => {
    modalService = jasmine.createSpyObj('BsModalService', ['show']);
    testResultsService = jasmine.createSpyObj('TestResultsService', [
      'findAll'
    ]);

    TestBed.configureTestingModule({
      declarations: [TestResultsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change', () => {
    expect(component).toBeTruthy();
  });
});
