import { DurationPipe } from '@core/duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it.each([
    [0, '0s'],
    [999, '0s'],
    [1000, '1s'],
    [60_000, '1m 0s'],
    [61_000, '1m 1s'],
    [3_600_000, '1h 0m 0s'],
    [3_661_000, '1h 1m 1s'],
    [86_400_000, '1d 0h 0m 0s'],
    [90_061_000, '1d 1h 1m 1s']
  ])('formats %i milliseconds as %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  it('discards partial seconds', () => {
    expect(pipe.transform(61_999)).toBe('1m 1s');
  });
});
