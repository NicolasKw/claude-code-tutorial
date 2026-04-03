import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AchievementOverlay } from '@/components/tutorial/AchievementOverlay';

describe('AchievementOverlay', () => {
  it('renders nothing when show is false', () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <AchievementOverlay show={false} level={3} onNavigate={onNavigate} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders overlay with "Nivel X completado" heading when show is true', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={3} onNavigate={onNavigate} />
    );
    expect(screen.getByText('Nivel 3 completado')).toBeDefined();
  });

  it('renders "Qué lograste" subheading', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={3} onNavigate={onNavigate} />
    );
    expect(screen.getByText('Qué lograste')).toBeDefined();
  });

  it('renders "Ir al Nivel X+1" CTA button for non-final levels', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={3} onNavigate={onNavigate} />
    );
    expect(screen.getByText('Ir al Nivel 4')).toBeDefined();
  });

  it('renders "Ver mi certificado" CTA button for level 7', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={6} onNavigate={onNavigate} />
    );
    expect(screen.getByText('Ver mi certificado')).toBeDefined();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={3} onNavigate={onNavigate} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('CTA button click calls onNavigate callback', () => {
    const onNavigate = vi.fn();
    render(
      <AchievementOverlay show={true} level={3} onNavigate={onNavigate} />
    );
    fireEvent.click(screen.getByText('Ir al Nivel 4'));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
