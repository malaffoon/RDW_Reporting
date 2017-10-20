import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByStudentComponent } from './by-student.component';
import { DataTableModule, SharedModule } from "primeng/primeng";
import { CommonModule } from "../../../../shared/common.module";
import { ScaleScoreComponent } from "../../scale-score.component";
import { PopupMenuComponent } from "../../../menu/popup-menu.component";
import { PopoverModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { MenuActionBuilder } from "../../../menu/menu-action.builder";
import { TestModule } from "../../../../../test/test.module";
import { ReportModule } from "../../../../report/report.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { TranslateModule } from "@ngx-translate/core";
import { Angulartics2 } from "angulartics2";
import { ScaleScoreService } from "../../../../shared/scale-score.service";
import { DataService } from "../../../../shared/data/data.service";
import { NotificationService } from "../../../../shared/notification/notification.service";
import { CachingDataService } from "../../../../shared/cachingData.service";
import { Component, EventEmitter } from "@angular/core";
import { MockDataService } from "../../../../../test/mock.data.service";
import { Assessment } from "../../../model/assessment.model";

describe('ByStudentComponent', () => {
  let component: ByStudentComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  let dataService: MockDataService;
  let service: MockNotificationService;
  let mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', [ 'eventTrack' ]);
  mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', [ 'next' ]);

  beforeEach(async(() => {
    dataService = new MockDataService();

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DataTableModule,
        FormsModule,
        HttpModule,
        SharedModule,
        PopoverModule.forRoot(),
        CommonModule,
        ReportModule,
        TranslateModule.forRoot(),
        TestModule
      ],
      declarations: [
        PopupMenuComponent,
        ScaleScoreComponent,
        TestComponentWrapper,
        ByStudentComponent
      ],
      providers: [
        { provide: Angulartics2, useValue: mockAngulartics2 },
        MenuActionBuilder,
        ScaleScoreService,
        { provide: DataService, useValue: dataService },
        { provide: NotificationService, useValue: service },
        { provide: CachingDataService, useValue: dataService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[ 0 ].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<by-student [assessment]="assessment" [exams]="[]" [minimumItemDataYear]="2017"></by-student>'
})
class TestComponentWrapper {
  assessment = new Assessment();
}

class MockNotificationService {
  onNotification: EventEmitter<Notification> = new EventEmitter();
}
