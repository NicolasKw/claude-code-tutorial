import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock drizzle-orm eq
vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

// Mock schema
vi.mock('@/db/schema', () => ({
  users: { id: 'id', name: 'name', linkedinUrl: 'linkedinUrl', createdAt: 'createdAt', sessionId: 'sessionId' },
  progress: { userId: 'userId', data: 'data', updatedAt: 'updatedAt' },
}));

// Mock db with inline factory (no references to outer variables — hoisting safe)
vi.mock('@/db', () => {
  const mockLimit = vi.fn();
  const mockWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockLeftJoin = vi.fn(() => ({ where: mockWhere }));
  const mockFrom = vi.fn(() => ({ leftJoin: mockLeftJoin }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return {
    db: { select: mockSelect },
  };
});

import { getUserForCertificate } from '@/lib/certificate';
import { db } from '@/db';

// Helper: drill into the mocked chain
function getMockLimit() {
  const select = vi.mocked(db.select);
  const fromResult = select.mock.results[0]?.value as { from: ReturnType<typeof vi.fn> } | undefined;
  if (!fromResult) return null;
  const leftJoinResult = fromResult.from.mock.results[0]?.value as { leftJoin: ReturnType<typeof vi.fn> } | undefined;
  if (!leftJoinResult) return null;
  const whereResult = leftJoinResult.leftJoin.mock.results[0]?.value as { where: ReturnType<typeof vi.fn> } | undefined;
  if (!whereResult) return null;
  const limitFn = whereResult.where.mock.results[0]?.value as { limit: ReturnType<typeof vi.fn> } | undefined;
  return limitFn?.limit ?? null;
}

describe('getUserForCertificate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-wire the chain after clearAllMocks resets mock return values
    const mockLimit = vi.fn();
    const mockWhere = vi.fn(() => ({ limit: mockLimit }));
    const mockLeftJoin = vi.fn(() => ({ where: mockWhere }));
    const mockFrom = vi.fn(() => ({ leftJoin: mockLeftJoin }));
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as ReturnType<typeof db.select>);
  });

  it('returns user data when userId exists', async () => {
    const fakeDate = new Date('2025-01-15T10:00:00Z');
    const fakeUpdatedAt = new Date('2025-01-20T12:00:00Z');
    const fakeResult = {
      name: 'Test User',
      linkedinUrl: 'https://linkedin.com/in/test',
      createdAt: fakeDate,
      progressData: {
        currentLevel: 6,
        completedLevels: [0, 1, 2, 3, 4, 5, 6],
        completedSteps: {},
        completedAt: '2025-01-20T12:00:00Z',
      },
      progressUpdatedAt: fakeUpdatedAt,
    };

    // Call getUserForCertificate with a mock that intercepts the full chain
    // We intercept at the limit() level by patching the entire select chain
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([fakeResult]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const result = await getUserForCertificate('user-123');

    expect(result).not.toBeNull();
    expect(result?.name).toBe('Test User');
    expect(result?.linkedinUrl).toBe('https://linkedin.com/in/test');
    expect(result?.createdAt).toEqual(fakeDate);
    expect(result?.progressData).toMatchObject({
      completedLevels: [0, 1, 2, 3, 4, 5, 6],
      completedAt: '2025-01-20T12:00:00Z',
    });
    expect(result?.progressUpdatedAt).toEqual(fakeUpdatedAt);
  });

  it('returns null when userId does not exist', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const result = await getUserForCertificate('nonexistent-user');

    expect(result).toBeNull();
  });
});
