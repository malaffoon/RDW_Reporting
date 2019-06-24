import { SessionExpiredComponent } from './session-expired.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;
import { SecurityService } from '../../service/security.service';

describe('SessionExpiredComponent', () => {
  let component: SessionExpiredComponent;
  let fixture: ComponentFixture<SessionExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SessionExpiredComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SecurityService, useValue: {} },
        { provide: Location, useClass: MockLocation }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockLocation {
  prepareExternalUrl: Spy = createSpy('prepareExternalUrl');
}
