// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/og ImageResponse before importing the route
// ImageResponse is used as a class constructor — define inside factory to avoid hoisting issues
vi.mock('next/og', () => {
  class ImageResponse extends Response {
    constructor(_element: unknown, _options?: unknown) {
      super('PNG_DATA', {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      });
    }
  }
  return { ImageResponse };
});

// Mock fs readFile to avoid actually reading font files during tests
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.from('mock-font-data')),
}));

// Mock the certificate query helper
vi.mock('@/lib/certificate', () => ({
  getUserForCertificate: vi.fn(),
}));

import { GET } from '../route';
import { getUserForCertificate } from '@/lib/certificate';

const mockUser = {
  name: 'Ana García',
  linkedinUrl: 'https://linkedin.com/in/ana-garcia',
  createdAt: new Date('2026-01-01'),
  progressData: {
    currentLevel: 7,
    completedLevels: [0, 1, 2, 3, 4, 5, 6],
    completedSteps: {},
    completedAt: '2026-03-15T12:00:00Z',
  },
  progressUpdatedAt: new Date('2026-03-15'),
};

function makeParams(userId: string): { params: Promise<{ userId: string }> } {
  return { params: Promise.resolve({ userId }) };
}

describe('GET /api/certificate/[userId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 with content-type image/png for valid userId', async () => {
    (getUserForCertificate as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    const response = await GET(new Request('http://localhost/api/certificate/test-id'), makeParams('test-id'));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('image/png');
  });

  it('returns 404 for non-existent userId', async () => {
    (getUserForCertificate as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/certificate/nonexistent'), makeParams('nonexistent'));

    expect(response.status).toBe(404);
  });

  it('calls getUserForCertificate with the correct userId', async () => {
    (getUserForCertificate as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

    const testUserId = 'abc-123-def';
    await GET(new Request(`http://localhost/api/certificate/${testUserId}`), makeParams(testUserId));

    expect(getUserForCertificate).toHaveBeenCalledWith(testUserId);
  });
});
