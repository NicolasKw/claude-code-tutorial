import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TutorialProgress } from '@/lib/types/tutorial';

// Mock the db module
vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([{ id: 'user-uuid' }]),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
}));

vi.mock('@/db/schema', () => ({
  users: { id: 'id', sessionId: 'session_id' },
  progress: { userId: 'user_id' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}));

const mockProgress: TutorialProgress = {
  currentLevel: 1,
  completedLevels: [0],
  completedSteps: { 0: [0, 1, 2] },
};

describe('saveProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('looks up user by sessionId', async () => {
    const { db } = await import('@/db');
    const { saveProgress } = await import('@/app/actions/progress');

    await saveProgress('test-session-id', mockProgress);

    expect(db.select).toHaveBeenCalled();
  });

  it('returns { success: false } when user not found', async () => {
    const { db } = await import('@/db');
    // Override limit to return empty array (user not found)
    vi.mocked(db.limit).mockResolvedValueOnce([]);

    const { saveProgress } = await import('@/app/actions/progress');
    const result = await saveProgress('unknown-session', mockProgress);

    expect(result).toEqual({ success: false });
  });

  it('upserts progress data with onConflictDoUpdate', async () => {
    const { db } = await import('@/db');
    vi.mocked(db.limit).mockResolvedValueOnce([{ id: 'user-uuid' }]);

    const mockOnConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
    const mockValues = vi.fn().mockReturnValue({ onConflictDoUpdate: mockOnConflictDoUpdate });
    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as ReturnType<typeof db.insert>);

    const { saveProgress } = await import('@/app/actions/progress');
    await saveProgress('test-session-id', mockProgress);

    expect(mockOnConflictDoUpdate).toHaveBeenCalled();
  });

  it('returns { success: true } on successful save', async () => {
    const { db } = await import('@/db');
    vi.mocked(db.limit).mockResolvedValueOnce([{ id: 'user-uuid' }]);

    const { saveProgress } = await import('@/app/actions/progress');
    const result = await saveProgress('test-session-id', mockProgress);

    expect(result).toEqual({ success: true });
  });
});
