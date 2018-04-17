import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import 'd3-selection-multi';
import { TranslateService } from '@ngx-translate/core';
import { DefaultSchool, Organization } from '../../shared/organization/organization';

// todo group "band" and area "assessment-performance-category-series"

interface GradeYear {
  grade: string;
  year: number;
}

interface Range<T> {
  minimum: T;
  maximum: T;
}

interface GradeYearScaleScore {
  readonly gradeYear: GradeYear;
  readonly scaleScore: number;
}

interface GradeYearScaleScoreRange {
  readonly gradeYear: GradeYear;
  readonly scaleScoreRange: Range<number>;
}

interface OrganizationPerformance {
  readonly organization: Organization;
  readonly gradeYearScaleScores: GradeYearScaleScore[];
}

interface PerformanceLevel {
  id: number;
  name: string;
}

interface AssessmentPerformance {
  level: PerformanceLevel;
  gradeYearScaleScoreRanges: GradeYearScaleScoreRange[];
}

interface Series<T> {

  readonly selector: string;
  visible: boolean;
  readonly data: T;

}

function createYearsAndGrades(first, count, step = 1, initialGap = 0) {
  const yearsAndGrades = [ first ];
  for (let i = 1 + initialGap; i < count; i++) {
    yearsAndGrades.push({
      year: first.year + i * step,
      grade: first.grade + i * step
    });
  }
  return yearsAndGrades;
}

function computeYearsWithoutGaps(years) {
  const min = years.reduce((min, value) => value < min ? value : min, years[ 0 ]);
  const max = years.reduce((max, value) => value > max ? value : max, years[ 0 ]);
  const yearsWithoutGaps = [];
  for (let year = min; year <= max; year++) {
    yearsWithoutGaps.push(year);
  }
  return yearsWithoutGaps;
}

function computeBands(areas, xScale, yScale) {
  return areas
  // gets the rightmost entries of each area
    .map(area => area.gradeYearScaleScoreRanges[ area.gradeYearScaleScoreRanges.length - 1 ])
    .map(area => {
      const h = yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum) ;
      // const h = Math.abs( yScale(area.scaleScoreRange.maximum) - yScale(area.scaleScoreRange.minimum) );
      const m = { x: 5, y: -2 };

      return Object.assign({
        bracket: {
          path: [
            { x: 0, y: m.y },
            { x: m.x, y: m.y },
            { x: m.x, y: h - m.y },
            { x: 0, y: h - m.y }
          ]
        }
      }, area);
    });
}

function createAreas(count, yearsAndGrades, scaleScoreRange: number[]): AssessmentPerformance[] {
  const [ minimumScaleScore, maximumScaleScore ] = scaleScoreRange;
  const areas = [];
  for (let i = 0; i < count; i++) {
    const area = [];
    for (let j = 0; j < yearsAndGrades.length; j++) {

      const previous = areas[ i - 1 ] != null
        && areas[ i - 1 ].gradeYearScaleScoreRanges != null
        && areas[ i - 1 ].gradeYearScaleScoreRanges[j] != null
          ? areas[ i - 1 ].gradeYearScaleScoreRanges[j].scaleScoreRange.maximum
          : minimumScaleScore + 10 * j + 25 * Math.random();

      const gradeYear = yearsAndGrades[ j ];
      area.push({
        gradeYear: gradeYear,
        scaleScoreRange: {
          minimum: previous,
          maximum: previous + 125 + 50 * Math.random()
        }
      });
    }
    areas.push({
      level: i + 1,
      gradeYearScaleScoreRanges: area
    });
  }
  return areas;
}

function createLines(count, yearsAndGrades, scaleScoreRange: number[]): OrganizationPerformance[] {
  const [ minimumScaleScore, maximumScaleScore ] = scaleScoreRange;
  const spread = maximumScaleScore - minimumScaleScore;
  const lines = [];
  for (let i = 0; i < count; i++) {
    const line = [];
    for (let j = 0; j < yearsAndGrades.length; j++) {
      const gradeYear = yearsAndGrades[ j ];

      const previous = lines[i - 1] != null
        && lines[i - 1].gradeYearScaleScores != null
        && lines[i - 1].gradeYearScaleScores[j] != null
          ? lines[i - 1].gradeYearScaleScores[j].scaleScore
          : minimumScaleScore + spread * 0.2 + spread * 0.02 * j + spread * 0.2 * Math.random()

      line.push({
        gradeYear: gradeYear,
        scaleScore: previous + 50 + 25 * Math.random()
      });

    }
    lines.push({
      organization: createOrganization(i + 1),
      gradeYearScaleScores: line,
      visible: true
    });
  }
  return lines;
}

function createOrganization(id: number): Organization {
  const organization = new DefaultSchool();
  organization.id = id;
  organization.name = `School name ${id}`;
  return organization;
}

@Component({
  selector: 'longitudinal-cohort-chart',
  templateUrl: 'longitudinal-cohort-chart.component.html'
})
export class LongitudinalCohortChartComponent implements OnInit {

  @Input()
  pallet: string = 'pallet-a';

  organizationPerformanceSeries: Series<OrganizationPerformance>[];

  private assessmentTypeCode: string = 'sum'; // for coloring;

  @ViewChild('chartContainer')
  private chartContainer: ElementRef;

  constructor(private translate: TranslateService) {

  }

  get root(): any {
    return (<any>d3.select(this.chartContainer.nativeElement));
  }

  toggleSeries<T>(series: Series<T>): void {
    series.visible = !series.visible;
    this.root.selectAll(series.selector)
      .classed('hidden', !series.visible);
  }

  ngOnInit(): void {

    const scaleScoreRange = [ 2000, 2800 ];
    const yearsAndGrades = createYearsAndGrades({ year: 2000, grade: 3 }, 10, 1, 4);
    const yearsWithoutGaps = computeYearsWithoutGaps(yearsAndGrades.map(d => d.year));

    const areas = createAreas(4, yearsAndGrades, scaleScoreRange);
    const lines = createLines(3, yearsAndGrades, scaleScoreRange);

    // set lines
    this.organizationPerformanceSeries = lines.map((line, index) => <any>{
      selector: `.series-${index}`,
      visible: true,
      data: line
    });

    const
      outerWidth = 800,
      outerHeight = 600,
      p = 20,
      m = 40,
      margin = { top: 0, right: m, bottom: m, left: m },
      padding = { top: 0, right: p * 3, bottom: p, left: p },
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom,
      domainMargin = { x: 0.33, y: 33 };

    const d3line = d3.line<any>()
      .x(({ x }) => xScale(x))
      .y(({ y }) => yScale(y));

    const d3area = d3.area<any>()
      .x(({ x }) => xScale(x))
      .y0(({ y0 }) => yScale(y0))
      .y1(({ y1 }) => yScale(y1));

    const xScale = d3.scaleLinear()
      .range([ 0, width ])
      .domain([ yearsAndGrades[ 0 ].year - domainMargin.x, yearsAndGrades[ yearsAndGrades.length - 1 ].year + domainMargin.x ]);

    const yScale = d3.scaleLinear()
      .range([ height, 0 ])
      .domain([ scaleScoreRange[ 0 ] - domainMargin.y, scaleScoreRange[ 1 ] + domainMargin.y ]);

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickPadding(m * 0.25)
      .tickFormat((d: number, i: number) => {
        // const {year, grade} = yearsAndGrades[i];
        const year = d;
        return `${year} - ${year + 1}`;
      })
      .ticks(yearsAndGrades.length)
      .tickValues(yearsWithoutGaps);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickPadding(m * 0.25);

    const svg = this.root.append('svg')
      .classed(`longitudinal-cohort-chart`, true)
      .attrs({
        width: outerWidth,
        height: outerHeight
      })
      .append('g')
      .attrs({
        transform: `translate(${margin.left}, ${margin.top})`
      });

    svg.append('g')
      .classed('x axis', true)
      .attrs({
        transform: `translate(0, ${height})`
      })
      .call(xAxis);

    svg.append('g')
      .classed('y axis', true)
      .call(yAxis);

    // Draw areas

    const performanceLevelArea = svg.append('g')
      .classed('scale-score-areas pallet-b', true)
      .selectAll('.scale-score-area')
      .data(areas)
      .enter()
      .append('g')
      .attrs({
        class: (d, i) => `scale-score-area color-${i}`
      });

    performanceLevelArea.append('path')
      .classed('color-fill', true)
      .attrs({
        d: d => d3area(d.gradeYearScaleScoreRanges.map(a => <any>{
          x: a.gradeYear.year,
          y0: a.scaleScoreRange.minimum,
          y1: a.scaleScoreRange.maximum
        }))
      });

    performanceLevelArea.append('path')
      .classed('scale-score-area-divider', true)
      .attrs({
        d: d => d3line(d.gradeYearScaleScoreRanges.map(a => <any>{
          x: a.gradeYear.year,
          y: a.scaleScoreRange.maximum
        }))
      });

    // Draw lines

    const performanceLevelTrend = svg.append('g')
      .classed('scale-score-lines pallet-a', true)
      .selectAll('.scale-score-line')
      .data(lines)
      .enter()
      .append('g')
      .attrs({
        class: (d, i) => `scale-score-line series-${i} color-${i}`
      });

    performanceLevelTrend.append('path')
      .classed('line color-stroke', true)
      .attrs({
        d: d => d3line(d.gradeYearScaleScores.map(a => <any>{
          x: a.gradeYear.year,
          y: a.scaleScore
        })),
      });

    // Draw dots

    performanceLevelTrend.selectAll('circle')
      .data(d => d.gradeYearScaleScores)
      .enter()
      .append('circle')
      .classed('point color-stroke', true)
      .attrs({
        r: 5,
        cx: d => xScale(d.gradeYear.year),
        cy: d => yScale(d.scaleScore)
      })
      .on('mouseover', (d, i, circles) => {
        d3.select(circles[i])
          .transition()
          .attr('r', 10);
      })
      .on('mouseout', (d, i, circles) => {
        d3.select(circles[i])
          .transition()
          .attr('r', 5);
      })
      .on('click', (d, i, circles) => {

      });

    // Correct x axis tick labels

    svg.selectAll('.axis.x .tick')
      .filter(d => yearsAndGrades.find(x => x.year === d))
      .append('text')
      .text((d, i) => {
        const grade = yearsAndGrades[ i ].grade.toString();
        const gradeCode = grade.length < 2 ? '0' + grade : grade;
        return this.translate.instant(`common.assessment-grade-label.${gradeCode}`);
      })
      .classed('grade', true)
      .attrs({
        'alignment-baseline': 'middle',
        'text-anchor': 'middle'
      });

    // Draw area labels

    // shouldn't need this...
    const d3lineNoScale = d3.line<any>()
      .x(({ x }) => x)
      .y(({ y }) => y);

    const bands = svg.append('g')
      .classed('scale-score-area-labels pallet-b', true)
      .attrs({
        transform: `translate(${width}, 0)`
      });

    const bandData = computeBands(areas, xScale, yScale);

    const band = bands.selectAll('.scale-score-area-label')
      .data(bandData)
      .enter()
      .append('g')
      .attrs({
        transform: d => `translate(0, ${yScale(d.scaleScoreRange.minimum)})`,
        class: (d, i) => `scale-score-area-label color-${i}`
      });

    const bandTitle = band
      .filter((d, i) => i === bandData.length - 1)
      .append('g')
      .classed('scale-score-area-labels-description', true);

    const title1 = bandTitle.append('text')
      .classed('text', true)
      .text(this.translate.instant('longitudinal-cohort-chart.area-description.text'));

    const title2 = bandTitle.append('text')
      .classed('subtext', true)
      .text(this.translate.instant('longitudinal-cohort-chart.area-description.subtext'));

    const title1Bounds = title1.node().getBBox();
    title2.attrs({
      transform: `translate(0, ${title1Bounds.height})`
    });

    const bandTitleBounds = bandTitle.node().getBBox();
    bandTitle.attrs({
      transform: d => `translate(10, ${(yScale(d.scaleScoreRange.maximum) - yScale(d.scaleScoreRange.minimum)) + bandTitleBounds.height * 0.4})` // magic number 0.4
    });

    band.append('path')
      .classed('bracket color-stroke', true)
      .attrs({
        d: d => d3lineNoScale(d.bracket.path)
      });

    const label = band.append('g')
      .classed('label-container', true)
      .attrs({
        transform: d => `translate(5, ${(yScale(d.scaleScoreRange.maximum) - yScale(d.scaleScoreRange.minimum)) * 0.5})`
      });

    const labelPadding = { top: 3, right: 5, bottom: 3, left: 3 };
    const labelRounding = (labelPadding.top + labelPadding.left) * 0.25;

    const labelRect = label.append('rect')
      .classed('color-fill', true)
      .attrs({
        rx: labelRounding,
        ry: labelRounding
      });

    const labelText = label.append('text')
      .classed('label-text', true)
      .text((d, i) => this.translate.instant(`common.assessment-type.${this.assessmentTypeCode}.performance-level.${i + 1}.name-prefix`));

    const labelTextBounds = labelText._groups[0].map(a => a.getBBox());

    labelText.attrs({
      // not sure why this y transform looks better than 0.5
      transform: (d, i) => `translate(${labelPadding.left}, ${labelTextBounds[ i ].height * 0.33})`
    });

    labelRect.attrs({
      y: (d, i) => -(labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom) * 0.5,
      width: (d, i) => labelTextBounds[ i ].width + labelPadding.left + labelPadding.right,
      height: (d, i) => labelTextBounds[ i ].height + labelPadding.top + labelPadding.bottom
    });

  }

}
