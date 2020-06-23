import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import {
  AssessmentItem,
  fullCreditItemCount,
  fullCreditItemPercent
} from '../../../model/assessment-item.model';
import { Exam } from '../../../model/exam';
import { ExamStatisticsCalculator } from '../../exam-statistics-calculator';
import { AssessmentProvider } from '../../../assessment-provider.interface';
import { Assessment } from '../../../model/assessment';
import { WritingTraitScoreSummary } from '../../../model/writing-trait-score-summary.model';
import { AssessmentExporter } from '../../../assessment-exporter.interface';
import { WritingTrait } from '../../../model/writing-trait.model';
import { RequestType } from '../../../../shared/enum/request-type.enum';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { flatMap, map, share, shareReplay, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { filter } from 'rxjs/internal/operators/filter';
import { first } from 'rxjs/internal/operators/first';
import { tap } from 'rxjs/internal/operators/tap';
import { sum } from '../../../../exam/model/score-statistics';
import { ExportWritingTraitsRequest } from '../../../model/export-writing-trait-request.model';
import { ExportResults } from '../export-results';
import { StudentResponsesAssessmentItem } from '../../../model/student-responses-item.model';

interface ItemView {
  item: AssessmentItem;
  responsesAssessmentItem?: StudentResponsesAssessmentItem;
  fullCreditCount: number;
  fullCreditPercent: number;
}

class Column {
  id: string;
  field: string;
  sortField: string;
  headerInfo: boolean;
  styleClass: string;
  sortable: boolean;

  // Writing trait item column properties
  index?: number;
  points?: number;

  constructor({
    id,
    field = '',
    sortField = '',
    headerInfo = false,
    styleClass = '',
    sortable = true,
    index = -1,
    points = -1
  }) {
    this.id = id;
    this.field = field ? field : id;
    this.sortField = sortField ? sortField : this.field;
    this.headerInfo = headerInfo;
    this.styleClass = styleClass;
    this.sortable = sortable;
    if (index >= 0) {
      this.index = index;
    }
    if (points >= 0) {
      this.points = points;
    }
  }
}

function toTraitSummaryColumns(
  summary: WritingTraitScoreSummary,
  summative: boolean
): Column[] {
  return (
    summary.total.numbers
      // remove the last two points for summative
      .filter((points, index) => !summative || index <= 4)
      .map(
        (points, index) =>
          new Column({
            id: 'item-point',
            points: points,
            index: index,
            styleClass: index === 0 ? 'level-down' : '',
            sortable: false
          })
      )
  );
}

@Component({
  selector: 'writing-trait-scores',
  templateUrl: './writing-trait-scores.component.html'
})
export class WritingTraitScoresComponent
  implements OnInit, OnDestroy, ExportResults {
  readonly totalType: string = WritingTrait.total().type;

  readonly writingTraitColumns: Column[] = [
    new Column({ id: 'number', field: 'position' }),
    new Column({ id: 'claim', field: 'claimTarget', headerInfo: true }),
    new Column({
      id: 'purpose',
      field: 'writingTraitType',
      headerInfo: true
    }),
    new Column({
      id: 'difficulty',
      sortField: 'difficultySortOrder',
      headerInfo: true
    }),
    new Column({
      id: 'standard',
      field: 'commonCoreStandardIds',
      headerInfo: true
    }),
    new Column({
      id: 'full-credit',
      field: 'fullCredit',
      headerInfo: true
    })
  ];

  /**
   * If true, values will be shown as percentages
   */
  @Input()
  showValuesAsPercent: boolean;

  /**
   * Service class which provides export capabilities=for this assessment and exam.
   */
  @Input()
  assessmentExporter: AssessmentExporter;

  /**
   * The assessment
   */
  @Input()
  set assessment(value: Assessment) {
    this.assessment$.next(value);
  }

  /**
   * Service class which provides assessment data for this assessment and exam.
   */
  @Input()
  set assessmentProvider(value: AssessmentProvider) {
    this.assessmentProvider$.next(value);
  }

  /**
   * The exams to show items for.
   */
  @Input()
  set exams(value: Exam[]) {
    this.exams$.next(value);
  }

  items$: Observable<AssessmentItem[]>;
  itemViews$: Observable<ItemView[]>;
  hasWritingTraitItems$: Observable<boolean>;
  traitScoreSummaries$: Observable<Map<string, WritingTraitScoreSummary>[]>;
  writingTraits$: Observable<string[]>;
  writingTraitType$: Observable<string>;
  summaryColumnsBySummary$: Observable<
    Map<string, Map<WritingTraitScoreSummary, Column[]>>
  >;
  exportRequest$: Observable<ExportWritingTraitsRequest>;
  initialized$: Observable<boolean>;

  private assessment$: Subject<Assessment> = new BehaviorSubject(undefined);
  private exams$: Subject<Exam[]> = new BehaviorSubject(undefined);
  private assessmentProvider$: Subject<
    AssessmentProvider
  > = new BehaviorSubject(undefined);
  private destroyed$: Subject<void> = new Subject();
  private _hasDataToExport: boolean;
  isDevMode = isDevMode();

  constructor(private examCalculator: ExamStatisticsCalculator) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    // this.assessment$.subscribe(val => console.log(val));
    this.writingTraits$ = this.assessment$.pipe(
      map(({ type }) =>
        type === 'sum'
          ? []
          : ['evidence', 'organization', 'conventions', 'total']
      )
    );

    // this.writingTraits$.subscribe(val => console.log(val));

    this.items$ = combineLatest(
      this.assessment$,
      this.assessmentProvider$
    ).pipe(
      takeUntil(this.destroyed$),
      flatMap(([assessment, provider]) =>
        provider.getAssessmentItems(assessment.id, ['WER'])
      ),
      // TODO should this really not update things when none have scores?
      filter(items => items.some(x => x.scores.length > 0)),
      share()
    );

    // this.items$.subscribe(val => console.log(val));

    this.hasWritingTraitItems$ = this.items$.pipe(
      map(items => items.length > 0)
    );

    // this.hasWritingTraitItems$.subscribe(val => console.log(val));

    this.writingTraitType$ = this.items$.pipe(
      map(items =>
        items.length > 0 ? items[0].performanceTaskWritingType : undefined
      )
    );

    this.itemViews$ = combineLatest(this.items$, this.exams$).pipe(
      takeUntil(this.destroyed$),
      map(([items, exams]) =>
        items.map(item => ({
          item: Object.assign(item, {
            scores: item.scores.filter(score =>
              exams.some(exam => exam.id === score.examId)
            )
          }),
          // TODO Uncomment to enable the writing trait tab
          // responsesAssessmentItem: toStudentResponsesAssessmentItem(item),
          fullCreditCount: fullCreditItemCount(item.scores, item.maxPoints),
          fullCreditPercent: fullCreditItemPercent(item.scores, item.maxPoints)
        }))
      ),
      tap(items => {
        this._hasDataToExport = items.length > 0;
      }),
      shareReplay(1)
    );

    // this.itemViews$.subscribe(val => console.log(val));

    this.traitScoreSummaries$ = combineLatest(
      this.assessment$,
      this.itemViews$
    ).pipe(
      takeUntil(this.destroyed$),
      map(([assessment, items]) => {
        if (assessment.type === 'sum') {
          // TODO: replace hardcoded traits and purposes with calls to services
          const traits = [
            new WritingTrait('EVI', 4),
            new WritingTrait('ORG', 4),
            new WritingTrait('CON', 2)
          ];
          const purposes = ['ARGU', 'EXPL', 'INFO', 'NARR', 'OPIN'];

          return this.examCalculator.aggregateExamWritingTraitScores(
            items.map(({ item }) => item),
            traits,
            purposes
          );
        }
        return this.examCalculator.aggregateWritingTraitScores(
          items.map(({ item }) => item)
        );
      }),
      shareReplay(1)
    );

    // console.log('Trait score summaries:');
    // this.traitScoreSummaries$.subscribe(val => console.log(val));

    this.summaryColumnsBySummary$ = combineLatest(
      this.assessment$,
      this.traitScoreSummaries$
    ).pipe(
      takeUntil(this.destroyed$),
      map(
        ([assessment, summaries]) => <any>new Map(
            summaries.map(summary => {
              if (summary.size === 0) {
                return [];
              }
              return <any>[
                summary,
                [
                  new Column({ id: 'category', sortable: false }),
                  new Column({
                    id: 'average-max',
                    sortable: false,
                    styleClass: 'level-up'
                  }),
                  ...toTraitSummaryColumns(
                    summary.values().next().value,
                    assessment.type === 'sum'
                  )
                ]
              ];
            })
          )
      )
    );

    // this.summaryColumnsBySummary$.subscribe(val => console.log(val));

    this.exportRequest$ = combineLatest(
      this.assessment$,
      this.itemViews$.pipe(map(items => items.map(({ item }) => item))),
      this.traitScoreSummaries$
    ).pipe(
      takeUntil(this.destroyed$),
      map(([assessment, assessmentItems, summaries]) => {
        return {
          assessment,
          assessmentItems,
          summaries: summaries,
          showAsPercent: this.showValuesAsPercent,
          type: RequestType.WritingTraitScores
        };
      })
    );

    // this.exportRequest$.subscribe(val => console.log(val));

    this.initialized$ = combineLatest(
      this.assessment$,
      this.exams$,
      this.assessmentProvider$
    ).pipe(
      takeUntil(this.destroyed$),
      map(values => values.every(value => value != null))
    );
  }

  hasDataToExport(): boolean {
    return this._hasDataToExport;
  }

  exportToCsv(): void {
    this.exportRequest$.pipe(first()).subscribe(request => {
      this.assessmentExporter.exportWritingTraitScoresToCsv(request);
    });
  }

  purposes(traitScoreSummary: Map<string, any>) {
    return Array.from(traitScoreSummary.keys());
  }
}
