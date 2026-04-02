import { describe, it, expect } from 'vitest';
import { registrationSchema } from '../validations';

describe('registrationSchema', () => {
  it('accepts valid name and linkedin URL', () => {
    const result = registrationSchema.safeParse({
      name: 'John Doe',
      linkedinUrl: 'https://linkedin.com/in/john-doe',
    });
    expect(result.success).toBe(true);
  });

  it('accepts URL without https and normalizes it', () => {
    const result = registrationSchema.safeParse({
      name: 'John',
      linkedinUrl: 'linkedin.com/in/john',
      email: 'j@example.com',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkedinUrl).toBe('https://linkedin.com/in/john');
    }
  });

  it('rejects empty name', () => {
    const result = registrationSchema.safeParse({
      name: '',
      linkedinUrl: 'https://linkedin.com/in/john',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it('rejects company page URL', () => {
    const result = registrationSchema.safeParse({
      name: 'John',
      linkedinUrl: 'https://linkedin.com/company/foo',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.linkedinUrl).toBeDefined();
    }
  });

  it('rejects empty linkedinUrl', () => {
    const result = registrationSchema.safeParse({
      name: 'John',
      linkedinUrl: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.linkedinUrl).toBeDefined();
    }
  });

  it('accepts missing email (undefined)', () => {
    const result = registrationSchema.safeParse({
      name: 'John',
      linkedinUrl: 'https://linkedin.com/in/john',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBeUndefined();
    }
  });

  it('rejects invalid email format', () => {
    const result = registrationSchema.safeParse({
      name: 'John',
      linkedinUrl: 'https://linkedin.com/in/john',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it('transforms linkedin.com/in/user to https://linkedin.com/in/user', () => {
    const result = registrationSchema.safeParse({
      name: 'User',
      linkedinUrl: 'linkedin.com/in/user',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.linkedinUrl).toBe('https://linkedin.com/in/user');
    }
  });
});
