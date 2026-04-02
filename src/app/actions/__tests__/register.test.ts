// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module before importing actions
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

import { registerUser } from '../actions';
import { db } from '@/db';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.append(key, value);
  }
  return fd;
}

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default behavior
    const mockInsert = db.insert as ReturnType<typeof vi.fn>;
    mockInsert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });
  });

  it('returns { success: true, sessionId: <uuid> } with valid data', async () => {
    const formData = makeFormData({
      name: 'Ana Garcia',
      linkedinUrl: 'https://linkedin.com/in/ana-garcia',
    });

    const result = await registerUser(null, formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.sessionId).toMatch(UUID_REGEX);
    }
  });

  it('returns { success: false, errors: { name: [...] } } with empty name', async () => {
    const formData = makeFormData({
      name: '',
      linkedinUrl: 'https://linkedin.com/in/ana-garcia',
    });

    const result = await registerUser(null, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.name.length).toBeGreaterThan(0);
    }
  });

  it('returns { success: false, errors: { linkedinUrl: [...] } } with invalid LinkedIn URL', async () => {
    const formData = makeFormData({
      name: 'Ana Garcia',
      linkedinUrl: 'https://twitter.com/user',
    });

    const result = await registerUser(null, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.linkedinUrl).toBeDefined();
      expect(result.errors.linkedinUrl.length).toBeGreaterThan(0);
    }
  });

  it('calls db.insert exactly once with valid data', async () => {
    const formData = makeFormData({
      name: 'Ana Garcia',
      linkedinUrl: 'https://linkedin.com/in/ana-garcia',
    });

    await registerUser(null, formData);

    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it('succeeds when email is empty (email is optional)', async () => {
    const formData = makeFormData({
      name: 'Ana Garcia',
      linkedinUrl: 'https://linkedin.com/in/ana-garcia',
      email: '',
    });

    const result = await registerUser(null, formData);

    expect(result.success).toBe(true);
  });
});
