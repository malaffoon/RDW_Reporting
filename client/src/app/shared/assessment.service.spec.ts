/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {HttpModule} from "@angular/http";
import {AssessmentService} from "./assessment.service";

describe('AssessmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [AssessmentService]
    });
  });

  it('should ...', inject([AssessmentService], (service: AssessmentService) => {
    expect(service).toBeTruthy();
  }));
});
