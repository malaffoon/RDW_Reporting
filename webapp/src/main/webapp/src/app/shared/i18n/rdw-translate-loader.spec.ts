import { RdwTranslateLoader } from './rdw-translate-loader';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { SubjectService } from '../../subject/subject.service';
import { of } from 'rxjs';
import { UserService } from '../security/service/user.service';

describe('RdwTranslateLoader', () => {
  const mockSubjectService = jasmine.createSpyObj('SubjectService', [
    'getSubjectCodes'
  ]);
  mockSubjectService.getSubjectCodes.and.returnValue(of(['Math', 'ELA']));

  const mockUserService = jasmine.createSpyObj('UserService', ['getUser']);
  mockUserService.getUser.and.returnValue(
    of({
      firstName: 'test',
      lastNane: 'test',
      permissions: [],
      anonymous: false,
      tenantName: 'something'
    })
  );

  let mockHttp: HttpTestingController;
  let mockClientData = {
    welcome: {
      title: 'Hello from UI',
      message: 'The UI welcomes you!',
      prompt: 'You have been prompted from the UI!'
    },
    labels: {
      'combo-box': 'Select'
    }
  };
  let mockServerData = {
    welcome: {
      title: 'Hello from API',
      message: 'The API welcomes you!'
    },
    subject: {
      Math: {
        'asmt-type': {
          ica: {
            name: 'ICA'
          },
          iab: {
            name: 'IAB'
          },
          sum: {
            name: 'SUM'
          }
        }
      },
      ELA: {
        'asmt-type': {
          ica: {
            name: 'ICA-2'
          },
          iab: {
            name: 'IAB-2'
          },
          sum: {
            name: 'SUM-2'
          }
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SubjectService, useValue: mockSubjectService },
        { provide: UserService, useValue: mockUserService }
      ]
    });
    mockHttp = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should merge api and ui translations', inject(
    [HttpClient, SubjectService, UserService],
    (
      http: HttpClient,
      subjectService: SubjectService,
      userService: UserService
    ) => {
      let loader = new RdwTranslateLoader(http, subjectService, userService);
      loader.getTranslation('en').subscribe((actual: any) => {
        expect(actual.welcome.title).toBe('Hello from API');
        expect(actual.welcome.message).toBe('The API welcomes you!');
        expect(actual.welcome.prompt).toBe(
          'You have been prompted from the UI!'
        );
        expect(actual.labels['combo-box']).toBe('Select');
        expect(actual.common['assessment-type'].ica['short-name']).toBe(
          'ICA/ICA-2'
        );
      });

      let clientResponse = mockHttp.expectOne('/assets/i18n/en.json');
      clientResponse.flush(mockClientData);

      let serverResponse = mockHttp.expectOne('/api/translations/en');
      serverResponse.flush(mockServerData);
    }
  ));

  /** ignore until caching is figured out
  it('should fall back to ui translations when no api translations are available', inject([HttpClient], (http: HttpClient) => {

    let loader = new RdwTranslateLoader(http);
    loader.getTranslation('en').subscribe(actual => {
      expect(actual.welcome.title).toBe('Hello from UI');
      expect(actual.welcome.message).toBe('The UI welcomes you!');
      expect(actual.welcome.prompt).toBe('You have been prompted from the UI!');
      expect(actual.labels[ 'combo-box' ]).toBe('Select');
    });

    let clientResponse = mockHttp.expectOne('/assets/i18n/en.json');
    clientResponse.flush(mockClientData);

    let serverResponse = mockHttp.expectOne('/api/translations/en');
    serverResponse.flush({});

  }));
   **/
});
