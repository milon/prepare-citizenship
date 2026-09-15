import { describe, expect, it } from 'vitest';
import { msUntilNextLocalMidnight } from './dates';

describe('msUntilNextLocalMidnight', () => {
  it('returns the remaining time before local midnight', () => {
    const now = new Date(2026, 8, 15, 18, 30, 0);
    const ms = msUntilNextLocalMidnight(now);
    expect(ms).toBe(5.5 * 60 * 60 * 1000);
  });

  it('is zero at midnight of the next day', () => {
    const now = new Date(2026, 8, 16, 0, 0, 0);
    expect(msUntilNextLocalMidnight(now)).toBe(24 * 60 * 60 * 1000);
  });
});
