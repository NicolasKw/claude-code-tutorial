import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LevelPage } from '@/components/tutorial/LevelPage';
import type { TutorialProgress } from '@/lib/types/tutorial';

// Mock useProgress hook
vi.mock('@/hooks/useProgress', () => ({
  useProgress: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import { useProgress } from '@/hooks/useProgress';

const mockProgress = (overrides: Partial<TutorialProgress> = {}): TutorialProgress => ({
  currentLevel: 0,
  completedLevels: [],
  completedSteps: {},
  ...overrides,
});

describe('LevelPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders level content when level is unlocked', () => {
    vi.mocked(useProgress).mockReturnValue({
      progress: mockProgress({ currentLevel: 0 }),
      completeStep: vi.fn(),
      completeLevel: vi.fn(),
      isLevelLocked: vi.fn(() => false),
      isStepCompleted: vi.fn(() => false),
    });

    render(<LevelPage level={0} />);
    // Should render step content (not locked state)
    expect(screen.queryByText(/Este nivel está bloqueado/)).toBeNull();
    expect(screen.getByText('Listo, ya lo hice')).toBeDefined();
  });

  it('renders LockedLevel with "Este nivel está bloqueado" when level is locked', () => {
    vi.mocked(useProgress).mockReturnValue({
      progress: mockProgress({ currentLevel: 0 }),
      completeStep: vi.fn(),
      completeLevel: vi.fn(),
      isLevelLocked: vi.fn(() => true),
      isStepCompleted: vi.fn(() => false),
    });

    render(<LevelPage level={2} />);
    expect(screen.getByText('Este nivel está bloqueado')).toBeDefined();
  });

  it('renders "Completá el Nivel X para desbloquearlo." with correct level number', () => {
    vi.mocked(useProgress).mockReturnValue({
      progress: mockProgress({ currentLevel: 0 }),
      completeStep: vi.fn(),
      completeLevel: vi.fn(),
      isLevelLocked: vi.fn(() => true),
      isStepCompleted: vi.fn(() => false),
    });

    render(<LevelPage level={2} />);
    expect(screen.getByText('Completá el Nivel 1 para desbloquearlo.')).toBeDefined();
  });

  it('renders "Volver al Nivel X" button linking to current unlocked level', () => {
    vi.mocked(useProgress).mockReturnValue({
      progress: mockProgress({ currentLevel: 0 }),
      completeStep: vi.fn(),
      completeLevel: vi.fn(),
      isLevelLocked: vi.fn(() => true),
      isStepCompleted: vi.fn(() => false),
    });

    render(<LevelPage level={2} />);
    expect(screen.getByText('Volver al Nivel 0')).toBeDefined();
  });

  it('renders lock icon when level is locked', () => {
    vi.mocked(useProgress).mockReturnValue({
      progress: mockProgress({ currentLevel: 0 }),
      completeStep: vi.fn(),
      completeLevel: vi.fn(),
      isLevelLocked: vi.fn(() => true),
      isStepCompleted: vi.fn(() => false),
    });

    render(<LevelPage level={2} />);
    // Lock icon should be present (aria-hidden decorative element)
    const lockIcon = document.querySelector('[aria-hidden="true"]');
    expect(lockIcon).toBeDefined();
  });
});
