import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CertificatePage } from '@/components/certificate/CertificatePage';

const defaultProps = {
  userId: 'test-uuid',
  userName: 'Test User',
  certificateUrl: 'https://example.com/certificate/test-uuid',
  postText: 'Test post text with Test User name',
  tutorialUrl: 'https://example.com/',
};

beforeEach(() => {
  vi.useFakeTimers();

  // Mock fetch for download
  global.fetch = vi.fn().mockResolvedValue({
    blob: vi.fn().mockResolvedValue(new Blob(['fake-png'], { type: 'image/png' })),
  } as unknown as Response);

  // Mock URL methods
  global.URL.createObjectURL = vi.fn().mockReturnValue('blob:fake-url');
  global.URL.revokeObjectURL = vi.fn();

  // Mock window.open
  global.window.open = vi.fn();

  // Mock clipboard
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('CertificatePage', () => {
  it('download button triggers fetch and blob download', async () => {
    // Spy on document.createElement to capture the anchor element
    const originalCreateElement = document.createElement.bind(document);
    const createdAnchors: HTMLAnchorElement[] = [];
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        vi.spyOn(el as HTMLAnchorElement, 'click').mockImplementation(() => {});
        createdAnchors.push(el as HTMLAnchorElement);
      }
      return el;
    });

    render(<CertificatePage {...defaultProps} />);

    const downloadButton = screen.getByRole('button', {
      name: /Descargar certificado como PNG/i,
    });
    expect(downloadButton).toBeDefined();

    await act(async () => {
      fireEvent.click(downloadButton);
      // Allow the async fetch chain to resolve
      await vi.runAllTimersAsync();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/certificate/test-uuid');
    expect(URL.createObjectURL).toHaveBeenCalled();

    // Check that an anchor with download attribute was created
    expect(createdAnchors.length).toBeGreaterThan(0);
    const downloadAnchor = createdAnchors[createdAnchors.length - 1];
    expect(downloadAnchor.download).toBe('certificado-claude-code.png');
  });

  it('share button calls window.open with LinkedIn share URL', async () => {
    render(<CertificatePage {...defaultProps} />);

    const shareButton = screen.getByRole('button', {
      name: /Compartir en LinkedIn/i,
    });

    await act(async () => {
      fireEvent.click(shareButton);
    });

    expect(global.window.open).toHaveBeenCalledWith(
      expect.stringContaining('linkedin.com/sharing/share-offsite'),
      '_blank',
      expect.any(String)
    );

    const callArgs = (global.window.open as ReturnType<typeof vi.fn>).mock.calls[0];
    const shareUrl = callArgs[0] as string;
    expect(shareUrl).toContain(encodeURIComponent('https://example.com/certificate/test-uuid'));
  });

  it('copy button calls navigator.clipboard.writeText', async () => {
    render(<CertificatePage {...defaultProps} />);

    const copyButton = screen.getByRole('button', {
      name: /Copiar texto del post/i,
    });

    await act(async () => {
      fireEvent.click(copyButton);
      await vi.runAllTimersAsync();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Test User')
    );
  });

  it('post text includes postText prop content', () => {
    render(<CertificatePage {...defaultProps} />);

    expect(screen.getByText('Test post text with Test User name')).toBeDefined();
  });

  it('shows copied state for 2 seconds after copy', async () => {
    render(<CertificatePage {...defaultProps} />);

    const copyButton = screen.getByRole('button', {
      name: /Copiar texto del post/i,
    });

    await act(async () => {
      fireEvent.click(copyButton);
      // Let clipboard promise resolve
      await Promise.resolve();
    });

    // After click, "Copiado" should appear
    expect(screen.getByText('Copiado')).toBeDefined();

    // After 2000ms, it should revert
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('Copiado')).toBeNull();
    expect(screen.getByText('Copiar texto')).toBeDefined();
  });
});
