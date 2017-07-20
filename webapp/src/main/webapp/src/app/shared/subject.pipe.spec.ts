import { async } from '@angular/core/testing';
import { SubjectPipe } from './subject.pipe';

describe('SubjectPipe', () => {
  it('should return all for subjectId of 0', async(() => {
    let target = new SubjectPipe();
    let actual = target.transform(0);

    expect(actual).toBe("MATH, ELA");
  }));

  it('should return MATH for subjectId of 1', async(() => {
    let target = new SubjectPipe();
    let actual = target.transform(1);

    expect(actual).toBe("MATH");
  }));

  it('should return ELA for subjectId of 2', async(() => {
    let target = new SubjectPipe();
    let actual = target.transform(2);

    expect(actual).toBe("ELA");
  }));

  it('should return empty string if subjectId is out of range', async(() => {
    let target = new SubjectPipe();
    let actual = target.transform(23);

    expect(actual).toBe("");
  }));
});
