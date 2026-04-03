import { describe, it } from 'vitest';

describe('LEVEL_CONTENT', () => {
  it.todo('exports exactly 7 level entries (levels 0-6) — CONT-04');

  it.todo('every level has a non-empty title and subtitle — CONT-04');

  it.todo('every level has a non-empty summary string — CONT-03');

  it.todo('every level has between 3 and 5 steps — CONT-05 time budget');

  it.todo('every step has a non-empty title and explanation — CONT-01');

  it.todo('every level has at least one step with a codeBlock — CONT-01');

  it.todo('every step has at least one errorCallout — CONT-02');

  it.todo('every errorCallout has non-empty trigger, error, and solution — CONT-02');

  it.todo('level numbers are sequential 0 through 6 — CONT-04');
});

describe('getLevelContent', () => {
  it.todo('returns the correct level by number');

  it.todo('returns undefined for level 7 (out of bounds)');
});
