import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssessmentExam } from '../model/assessment-exam.model';
import { ExamStatistics, ExamStatisticsLevel } from '../model/exam-statistics.model';
import { InstructionalResource } from '../model/instructional-resources.model';
import { InstructionalResourcesService } from './instructional-resources.service';
import { ColorService } from '../../shared/color.service';
import { AssessmentProvider } from '../assessment-provider.interface';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ClaimStatistics } from '../model/claim-score.model';
import { ExamStatisticsCalculator } from './exam-statistics-calculator';
import { PerformanceLevel, SubjectDefinition } from '../../subject/subject';
import { SubjectService } from '../../subject/subject.service';

enum ScoreViewState {
  OVERALL = 1,
  CLAIM = 2
}

interface PerformanceLevelView {
  readonly data: ExamStatisticsLevel;
  readonly definition: PerformanceLevel;
}

/**
 * This component is responsible for displaying the average scale score visualization
 */
@Component({
  selector: 'average-scale-score',
  templateUrl: './average-scale-score.component.html'
})
export class AverageScaleScoreComponent implements OnInit {

  @Input()
  showValuesAsPercent: boolean = true;

  @Input()
  assessmentExam: AssessmentExam;

  @Input()
  statistics: ExamStatistics;

  @Input()
  assessmentProvider: AssessmentProvider;

  @Output()
  onScoreViewToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  instructionalResourcesProvider: () => Observable<InstructionalResource[]>;

  displayState: any = {
    showClaim: ScoreViewState.OVERALL
  };

  private _averageScore: number;
  private _totalCount: number;
  private _claimDataWidths: Array<number[]>;
  private _subjectDefinition: SubjectDefinition;
  private _performanceLevelPercents: PerformanceLevelView[];
  private _performanceLevelCounts: PerformanceLevelView[];

  constructor(public colorService: ColorService,
              private instructionalResourcesService: InstructionalResourcesService,
              private translate: TranslateService,
              private examCalculator: ExamStatisticsCalculator,
              private subjectService: SubjectService) {
  }

  ngOnInit(): void {
    this.subjectService.getSubjectDefinitionForAssessment(this.assessmentExam.assessment)
      .subscribe(subjectDefinition => {
        this._subjectDefinition = subjectDefinition;

        // init
        const value = this.statistics;
        if (!value) {
          return;
        }

        this._averageScore = !isNaN(value.average) ? Math.round(value.average) : value.average;

        if (value.levels) {
          this._totalCount = value.levels
            .map(examStatisticsLevel => examStatisticsLevel.value)
            .reduce((total, levelCount) => total + levelCount);
        }

        // pre-calculates the data widths for the graph representation for all of the claims
        this._claimDataWidths = value.claims.map(claimStatistics =>
          this.examCalculator.getDataWidths(claimStatistics.percents.map(percent => percent.value))
        );

        this._performanceLevelPercents = this.statistics.percents
          .map((value, index) => <PerformanceLevelView>{
            data: value,
            definition: this._subjectDefinition.performanceLevels[ index ]
          })
          .reverse();

        this._performanceLevelCounts = this.statistics.levels
          .map((value, index) => <PerformanceLevelView>{
            data: value,
            definition: this._subjectDefinition.performanceLevels[ index ]
          })
          .reverse();
      });
  }

  get subjectDefinition(): SubjectDefinition {
    return this._subjectDefinition;
  }

  get averageScore(): number {
    return this._averageScore;
  }

  get claimCodes(): string[] {
    return this.assessmentExam.assessment.claimCodes;
  }

  getClaimDataWidth(claimIndex: number, levelIndex: number): number {
    return this._claimDataWidths[ claimIndex ][ levelIndex ];
  }

  getClaimValue(claimStats: ClaimStatistics, index: number): number {
    return this.showValuesAsPercent ? Math.round(claimStats.percents[ index ].value) : claimStats.levels[ index ].value;
  }

  getClaimSuffix(claimStats: ClaimStatistics, index: number): string {
    return this.showValuesAsPercent ? claimStats.percents[ index ].suffix : claimStats.levels[ index ].suffix;
  }

  get isClaimScoreSelected(): boolean {
    return this.displayState.table == ScoreViewState.CLAIM;
  }

  public setClaimScoreSelected(): void {
    this.displayState.table = ScoreViewState.CLAIM;
    this.onScoreViewToggle.emit(true);
  }

  public setOverallScoreSelected(): void {
    this.displayState.table = ScoreViewState.OVERALL;
    this.onScoreViewToggle.emit(false);
  }

  get showClaimToggle(): boolean {
    return !this.assessmentExam.assessment.isIab;
  }

  get hasAverageScore(): boolean {
    return !isNaN(this.averageScore);
  }

  get performanceLevels(): PerformanceLevelView[] {
    return this.showValuesAsPercent
      ? this._performanceLevelPercents
      : this._performanceLevelCounts;
  }

  /**
   * Calculates the amount of the bar filled by the ExamStatisticsLevel
   * @param {ExamStatisticsLevel} examStatisticsLevel
   * @returns {number} the amount filled by the examStatisticsLevel (0-100)
   */
  filledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    return this.showValuesAsPercent ? Math.floor(examStatisticsLevel.value) : this.levelCountPercent(examStatisticsLevel.value);
  }

  /**
   * Calculates the amount of the bar unfilled by the ExamStatisticsLevel
   * @param {ExamStatisticsLevel} examStatisticsLevel
   * @returns {number} the amount unfilled by the examStatisticsLevel (0-100)
   */
  unfilledLevel(examStatisticsLevel: ExamStatisticsLevel): number {
    return 100 - this.filledLevel(examStatisticsLevel);
  }

  // examLevelTranslation(performanceLevel: ExamStatisticsLevel): string {
  //   return this.translate.instant(performanceLevel.id ? `common.assessment-type.${this.assessmentExam.assessment.type}.performance-level.${performanceLevel.id}.name` : 'common.missing')
  // }

  private levelCountPercent(levelCount: number): number {
    return Math.floor(levelCount / this._totalCount * 100);
  }

  loadInstructionalResources(performanceLevel: number) {
    this.instructionalResourcesProvider = () => this.instructionalResourcesService.getInstructionalResources(this.assessmentExam.assessment.id, this.assessmentProvider.getSchoolId())
      .map(resources => resources.getResourcesByPerformance(performanceLevel));
  }
}
