import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '../../support/support';
import { PerformanceLevelDisplayTypes } from '../../display-options/performance-level-display-type';
import { SubjectDefinition } from '../../../subject/subject';
import { TranslateService } from '@ngx-translate/core';

/**
 * Performance level distribution chart view
 */
@Component({
  selector: 'performance-level-distribution-chart',
  templateUrl: 'performance-level-distribution-chart.component.html',
  host: { class: 'performance-level-distribution-chart' }
})
export class PerformanceLevelDistributionChart implements OnInit {
  private _percentages: number[] = [];
  private _subjectDefinition: SubjectDefinition;
  private _cutPoint: number;
  private _center: boolean = false;
  private _displayType: string = PerformanceLevelDisplayTypes.Separate;
  private _loaded: boolean = false;
  private _visible: boolean = true;
  private _performanceLevelBarsByDisplayType: Map<
    string,
    Map<boolean, PerformanceLevelBars>
  > = new Map();
  private _useClaimColors: boolean = false;
  private _useAltScoreColors: boolean = false;

  constructor(private translateService: TranslateService) {}

  /**
   * The performance level percentages
   *
   * @returns {number[]}
   */
  get percentages(): number[] {
    return this._percentages;
  }

  @Input()
  set percentages(value: number[]) {
    if (this._percentages !== value) {
      this._percentages = value;
      this._loaded && this.update();
    }
  }

  /**
   * The assessment type code of the distribution.
   * This determines the bar colors.
   *
   * @returns {string}
   */
  get assessmentTypeCode(): string {
    return this._subjectDefinition.assessmentType;
  }

  @Input()
  set subjectDefinition(value: SubjectDefinition) {
    if (this._subjectDefinition !== value) {
      this._subjectDefinition = value;
      this._loaded && this.update();
    }
  }

  get subjectDefinition(): SubjectDefinition {
    return this._subjectDefinition;
  }

  /**
   * The performance level display type.
   * This determines if the bars will display separately or grouped.
   *
   * @returns {string}
   */
  get displayType(): string {
    return this._displayType;
  }

  @Input()
  set displayType(value: string) {
    this._displayType = PerformanceLevelDisplayTypes.valueOf(value);
  }

  /**
   * If true the bars will be centered around a dividing line.
   *
   * @returns {boolean}
   */
  get center(): boolean {
    return this._center;
  }

  @Input()
  set center(value: boolean) {
    this._center = value;
  }

  /**
   * Indicates where to divide the bars when centered
   *
   * @returns {number}
   */
  get cutPoint(): number {
    return this._cutPoint;
  }

  @Input()
  set cutPoint(value: number) {
    if (this._cutPoint !== value) {
      this._cutPoint = value;
      this._loaded && this.update();
    }
  }

  get useClaimColors(): boolean {
    return this._useClaimColors;
  }

  @Input()
  set useClaimColors(value: boolean) {
    this._useClaimColors = value;
  }

  get useAltScoreColors(): boolean {
    return this._useAltScoreColors;
  }

  @Input()
  set useAltScoreColors(value: boolean) {
    this._useAltScoreColors = value;
  }

  /**
   * True if the percentages amount to more than 0
   *
   * @returns {boolean}
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Gets the performance level bar views based on the current display state
   *
   * @returns {PerformanceLevelBars}
   */
  get performanceLevelBars(): PerformanceLevelBars {
    return this._performanceLevelBarsByDisplayType
      .get(this.displayType)
      .get(this.center);
  }

  ngOnInit(): void {
    this.update();
    this._loaded = true;
  }

  /**
   * Called when the performance level bars need to be re-computed
   */
  private update(): void {
    this.validateState();
    this.computeBars();
  }

  /**
   * Validates that the combination of input parameters are valid
   */
  private validateState(): void {
    if (Utils.isNullOrEmpty(this.percentages)) {
      throw new Error('value must not be null or empty');
    }
    if (this.percentages.length < 2) {
      throw new Error('value size must not be less than 2');
    }
    if (Utils.isUndefined(this.assessmentTypeCode)) {
      throw new Error('assessment type code undefined');
    }
    if (Utils.isUndefined(this.displayType)) {
      throw new Error('display type undefined');
    }
    if (this.cutPoint < 0 && this.cutPoint >= this.percentages.length) {
      throw new Error(
        'Cut point must be a positive integer between 0 and the number of values (' +
          this.percentages.length +
          ')'
      );
    }
  }

  /**
   * Computes all bar view configurations for quick switching of display type and centered properties
   */
  private computeBars(): void {
    const cutPoint: number = this.effectiveCutPoint;
    const cutPointIndex: number = cutPoint - 1;
    const sum = (total, value) => total + value;

    // create bars to switch to when performance level display type is switched
    const separateBars: PerformanceLevelBar[] = this.percentages.map(
      (value, index) =>
        <PerformanceLevelBar>{
          width: value,
          classes: this.getPerformanceLevelColor(index + 1)
        }
    );

    const groupedBars: PerformanceLevelBar[] = [
      {
        width: this.percentages.slice(0, cutPointIndex).reduce(sum),
        classes: this.getPerformanceLevelColor(cutPoint - 1)
      },
      {
        width: this.percentages.slice(cutPointIndex).reduce(sum),
        classes: this.getPerformanceLevelColor(cutPoint)
      }
    ];

    this._visible = this.percentages.reduce(sum) > 0;

    // create bars to switch to when centered flag is switched
    this._performanceLevelBarsByDisplayType.set(
      PerformanceLevelDisplayTypes.Separate,
      new Map<boolean, PerformanceLevelBars>([
        [
          true,
          {
            left: separateBars.slice(0, cutPointIndex),
            right: separateBars.slice(cutPointIndex)
          }
        ],
        [false, { left: separateBars, right: [] }]
      ])
    );

    this._performanceLevelBarsByDisplayType.set(
      PerformanceLevelDisplayTypes.Grouped,
      new Map<boolean, PerformanceLevelBars>([
        [true, { left: [groupedBars[0]], right: [groupedBars[1]] }],
        [false, { left: groupedBars, right: [] }]
      ])
    );
  }

  private getPerformanceLevelColor(level: number) {
    const placeholder = this.useClaimColors
      ? 'claim-score.'
      : this.useAltScoreColors
      ? 'alt-score.'
      : '';

    return this.translateService.instant(
      `subject.${this.subjectDefinition.subject}.asmt-type.${
        this.subjectDefinition.assessmentType
      }.${placeholder}level.${level}.color`
    );
  }

  /**
   * Gets the cut point or an assumed cut point if an explicit one was not set
   */
  private get effectiveCutPoint(): number {
    return Utils.isUndefined(this._cutPoint)
      ? Math.ceil(this.percentages.length * 0.5)
      : this._cutPoint;
  }
}

/**
 * Performance level views categorized by display location
 */
interface PerformanceLevelBars {
  /**
   * Bars left of center when center is true
   * All bars when center is false
   */
  readonly left: PerformanceLevelBar[];

  /**
   * Bars right of center when center is true
   */
  readonly right: PerformanceLevelBar[];
}

/**
 * A performance level view
 */
interface PerformanceLevelBar {
  /**
   * The bar's width [0 - 100]
   */
  readonly width: number;

  /**
   * The bar's css classes
   */
  readonly classes: string;
}
