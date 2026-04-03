import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TutorialHeader } from '../tutorial/TutorialHeader';

describe('TutorialHeader', () => {
  it('renders "Nivel X de 7" badge with current level number', () => {
    render(<TutorialHeader currentLevel={3} />);
    expect(screen.getByText('Nivel 3 de 7')).toBeInTheDocument();
  });

  it('renders progress bar with correct aria-valuenow based on currentLevel', () => {
    render(<TutorialHeader currentLevel={3} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', String(Math.round((3 / 7) * 100)));
  });

  it('progress bar aria-valuemin is 0 and aria-valuemax is 100', () => {
    render(<TutorialHeader currentLevel={3} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('progress bar has aria-label "Progreso del tutorial"', () => {
    render(<TutorialHeader currentLevel={3} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-label', 'Progreso del tutorial');
  });

  it('header has sticky positioning class', () => {
    const { container } = render(<TutorialHeader currentLevel={1} />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
  });
});
