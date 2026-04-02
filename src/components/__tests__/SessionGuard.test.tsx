import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SessionGuard } from '../SessionGuard';

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock @/lib/session
const mockGetSessionId = vi.fn();
vi.mock('@/lib/session', () => ({
  getSessionId: () => mockGetSessionId(),
}));

describe('SessionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls router.replace("/") when no sessionId in localStorage', async () => {
    mockGetSessionId.mockReturnValue(null);

    render(
      <SessionGuard>
        <div>Protected content</div>
      </SessionGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('renders children when sessionId exists in localStorage', async () => {
    mockGetSessionId.mockReturnValue('test-session-id-123');

    render(
      <SessionGuard>
        <div>Protected content</div>
      </SessionGuard>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected content')).toBeDefined();
    });
  });

  it('shows a loading spinner while checking session', () => {
    mockGetSessionId.mockReturnValue(null);

    const { container } = render(
      <SessionGuard>
        <div>Protected content</div>
      </SessionGuard>
    );

    // While not yet checked, a loading indicator should be present (not null/empty)
    expect(container.firstChild).not.toBeNull();
  });
});
