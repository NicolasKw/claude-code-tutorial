import { describe, it, expect } from 'vitest';
import { LEVEL_CONTENT, getLevelContent } from '@/lib/content/levels';

describe('LEVEL_CONTENT', () => {
  it('exports exactly 7 level entries (levels 0-6) — CONT-04', () => {
    expect(LEVEL_CONTENT).toHaveLength(7);
  });

  it('every level has a non-empty title and subtitle — CONT-04', () => {
    for (const level of LEVEL_CONTENT) {
      expect(level.title.length).toBeGreaterThan(0);
      expect(level.subtitle.length).toBeGreaterThan(0);
    }
  });

  it('every level has a non-empty summary string — CONT-03', () => {
    for (const level of LEVEL_CONTENT) {
      expect(level.summary.length).toBeGreaterThan(0);
    }
  });

  it('every level has between 3 and 5 steps — CONT-05 time budget', () => {
    for (const level of LEVEL_CONTENT) {
      expect(level.steps.length).toBeGreaterThanOrEqual(3);
      expect(level.steps.length).toBeLessThanOrEqual(5);
    }
  });

  it('every step has a non-empty title and explanation — CONT-01', () => {
    for (const level of LEVEL_CONTENT) {
      for (const step of level.steps) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.explanation.length).toBeGreaterThan(0);
      }
    }
  });

  it('every level has at least one step with a codeBlock — CONT-01', () => {
    for (const level of LEVEL_CONTENT) {
      const hasCodeBlock = level.steps.some(s => s.codeBlock !== undefined);
      expect(hasCodeBlock).toBe(true);
    }
  });

  it('every step has at least one errorCallout — CONT-02', () => {
    for (const level of LEVEL_CONTENT) {
      for (const step of level.steps) {
        expect(step.errorCallouts.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('every errorCallout has non-empty trigger, error, and solution — CONT-02', () => {
    for (const level of LEVEL_CONTENT) {
      for (const step of level.steps) {
        for (const callout of step.errorCallouts) {
          expect(callout.trigger.length).toBeGreaterThan(0);
          expect(callout.error.length).toBeGreaterThan(0);
          expect(callout.solution.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('level numbers are sequential 0 through 6 — CONT-04', () => {
    const levels = LEVEL_CONTENT.map(l => l.level);
    expect(levels).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});

describe('getLevelContent', () => {
  it('returns the correct level by number', () => {
    const level0 = getLevelContent(0);
    expect(level0).toBeDefined();
    expect(level0!.level).toBe(0);

    const level6 = getLevelContent(6);
    expect(level6).toBeDefined();
    expect(level6!.level).toBe(6);
  });

  it('returns undefined for level 7 (out of bounds)', () => {
    expect(getLevelContent(7)).toBeUndefined();
  });
});
