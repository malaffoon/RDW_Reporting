import { Injectable } from "@angular/core";
import { DataService } from "../../shared/data/data.service";
import { Observable } from "rxjs/Observable";
import { Percentile, PercentileGroup, PercentileScore } from "./assessment-percentile";
import { DatePipe } from "@angular/common";
import { delay, map } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import * as _ from "lodash";

@Injectable()
export class AssessmentPercentileService {

  constructor(private dataService: DataService,
              private datePipe: DatePipe) {
  }

  getPercentiles(request: AssessmentPercentileRequest): Observable<Percentile[]> {
    // return this.dataService
    //   .get(`${ReportingServiceRoute}/assessment-percentiles`, {
    //     params: this.toServerRequest(request)
    //   });

    const a = [ 1, 2, 3 ].map(value => <Percentile>{
      assessmentId: 1,
      startDate: new Date(2018, 12 - value, 1),
      endDate: new Date(2018, 12 - value - 1, 1),
      count: 30000,
      mean: 2000,
      standardDeviation: 50,
      scores: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
        .map(input => <PercentileScore>{
          rank: input * 5,
          score: Math.floor( input * 100 + Math.random() * 1000)
        })
    });

    const b = [4, 5].map(value => <Percentile>{
      assessmentId: 1,
      startDate: new Date(2018, 12 - value, 1),
      endDate: new Date(2018, 12 - value, 1),
      count: 30000,
      mean: 2000,
      standardDeviation: 50,
      scores: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        .map(input => <PercentileScore>{
          rank: input * 10,
          score: Math.floor( input * 100 + Math.random() * 1000)
        })
    });

    return of([...a, ...b]).pipe(delay(500));
  }

  getPercentilesGroupedByRank(request: AssessmentPercentileRequest): Observable<PercentileGroup[]> {
    return this.getPercentiles(request).pipe(map(percentiles => {
      if (percentiles.length == 0) {
        return [];
      }
      const groups: PercentileGroup[] = [];
      for (let i = 0; i < percentiles.length; i++) {
        const previousGroup = groups[groups.length - 1];
        const percentile = percentiles[i];
        const percentileRanks = percentile.scores.map(score => score.rank);
        if (groups.length === 0
        || !_.isEqual(previousGroup.ranks, percentileRanks)) {
          groups.push({
            ranks: percentileRanks,
            percentiles: [percentile]
          })
        } else {
          previousGroup.percentiles.push(percentile);
        }
      }
      return groups;
    }));
  }

  private toServerRequest(request: AssessmentPercentileRequest): AssessmentPercentileServerRequest {
    return {
      assessmentId: request.assessmentId,
      startDate: this.formatAsLocalDate(request.from),
      endDate: this.formatAsLocalDate(request.to)
    };
  }

  private formatAsLocalDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}

export interface AssessmentPercentileRequest {
  assessmentId: number;
  from: Date;
  to: Date;
}

interface AssessmentPercentileServerRequest {
  assessmentId: number;
  startDate: string;
  endDate: string;
}
