import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/certificate', () => ({
  getUserForCertificate: vi.fn().mockResolvedValue({
    name: 'Test User',
    linkedinUrl: 'https://linkedin.com/in/testuser',
    createdAt: new Date('2026-01-01'),
    progressData: null,
    progressUpdatedAt: null,
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('certificate/[userId] page generateMetadata', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
  });

  it('generateMetadata returns og:image URL matching /api/certificate/ pattern', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ userId: 'test-user-id' }),
    });

    const images = metadata.openGraph?.images;
    expect(images).toBeDefined();
    const firstImage = Array.isArray(images) ? images[0] : images;
    const imageUrl = typeof firstImage === 'string'
      ? firstImage
      : firstImage instanceof URL
        ? firstImage.toString()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (firstImage as any)?.url as string;
    expect(imageUrl).toContain('/api/certificate/test-user-id');
  });

  it('og:image URL is absolute (starts with http)', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ userId: 'test-user-id' }),
    });

    const images = metadata.openGraph?.images;
    const firstImage = Array.isArray(images) ? images[0] : images;
    const imageUrl = typeof firstImage === 'string'
      ? firstImage
      : firstImage instanceof URL
        ? firstImage.toString()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (firstImage as any)?.url as string;
    expect(imageUrl).toMatch(/^https?:\/\//);
    expect(imageUrl).toBe('https://example.com/api/certificate/test-user-id');
  });

  it('og:title contains Claude Code', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ userId: 'test-user-id' }),
    });

    expect(metadata.openGraph?.title).toContain('Claude Code');
  });

  it('og:description contains the correct text', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ userId: 'test-user-id' }),
    });

    expect(metadata.description).toContain('Aprendí a construir un bot de gestión personal');
  });

  it('og:url uses NEXT_PUBLIC_BASE_URL', async () => {
    const { generateMetadata } = await import('../page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ userId: 'test-user-id' }),
    });

    expect(metadata.openGraph?.url).toBe('https://example.com/certificate/test-user-id');
  });
});
