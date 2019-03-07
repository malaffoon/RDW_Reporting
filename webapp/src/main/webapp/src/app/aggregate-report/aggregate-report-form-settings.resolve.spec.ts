import { AggregateReportFormSettingsResolve } from './aggregate-report-form-settings.resolve';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AggregateReportRequestMapper } from './aggregate-report-request.mapper';
import { AggregateReportOptionsMapper } from './aggregate-report-options.mapper';
import { AggregateReportFormSettings } from './aggregate-report-form-settings';
import { of } from 'rxjs';
import { UserQueryService } from '../report/user-query.service';
import { UserReportService } from '../report/user-report.service';
import Spy = jasmine.Spy;

describe('AggregateReportFormSettingsResolve', () => {
  let userReportService: UserReportService;
  let userQueryService: UserQueryService;
  let optionMapper: AggregateReportOptionsMapper;
  let requestMapper: AggregateReportRequestMapper;
  let fixture: AggregateReportFormSettingsResolve;

  beforeEach(() => {
    userReportService = jasmine.createSpyObj('UserReportService', [
      'getReport'
    ]);
    userQueryService = jasmine.createSpyObj('UserQueryService', ['getQuery']);
    optionMapper = jasmine.createSpyObj('AggregateReportOptionMapper', [
      'toDefaultSettings'
    ]);
    requestMapper = jasmine.createSpyObj('AggregateReportRequestMapper', [
      'toSettings'
    ]);
    fixture = new AggregateReportFormSettingsResolve(
      userReportService,
      userQueryService,
      optionMapper,
      requestMapper
    );
  });

  it('should return request settings when report param is present. It should also add to the name.', () => {
    const reportId = 1;
    const defaultSettings: AggregateReportFormSettings = <any>{};
    const reportSettings: AggregateReportFormSettings = <any>{ name: 'A' };
    const report: any = {};
    (optionMapper.toDefaultSettings as Spy).and.callFake(() => defaultSettings);
    (userReportService.getReport as Spy).and.callFake(() => of(report));
    (requestMapper.toSettings as Spy).and.callFake(() => of(reportSettings));

    fixture.resolve(routeWithReport(reportId), <any>{}).subscribe(settings => {
      expect(settings).toEqual(<any>{
        name: 'A (1)'
      });
    });

    expect(userReportService.getReport as Spy).toHaveBeenCalledWith(reportId);
  });

  it('should return default settings when report param is absent', () => {
    const defaultSettings: any = {};
    (optionMapper.toDefaultSettings as Spy).and.callFake(() =>
      of(defaultSettings)
    );

    fixture.resolve(routeWithoutReport(), <any>{}).subscribe(settings => {
      expect(settings).toBe(defaultSettings);
    });
  });

  function routeWithReport(reportId: number): ActivatedRouteSnapshot {
    return <any>{
      parent: { data: {} },
      queryParams: { userReportId: String(reportId) },
      queryParamMap: new Map([['userReportId', String(reportId)]])
    };
  }

  function routeWithoutReport(): ActivatedRouteSnapshot {
    return <any>{
      parent: { data: {} },
      queryParams: {},
      queryParamMap: new Map([])
    };
  }
});
