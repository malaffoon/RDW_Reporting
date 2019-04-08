import { color } from './colors';

describe('color', () => {
  it('should transform a number to a color', () => {
    expect(color(9999)).not.toBeNull();
  });
  it('should rotate colors', () => {
    expect(color(0)).not.toEqual(color(1));
  });
});
