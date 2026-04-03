import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepCard } from '@/components/tutorial/StepCard';

describe('StepCard', () => {
  it('renders step content', () => {
    const onComplete = vi.fn();
    render(
      <StepCard stepIndex={0} isCompleted={false} isFinalStep={false} onComplete={onComplete}>
        <p>Step content here</p>
      </StepCard>
    );
    expect(screen.getByText('Step content here')).toBeDefined();
  });

  it('renders "Listo, ya lo hice" button when step is not completed', () => {
    const onComplete = vi.fn();
    render(
      <StepCard stepIndex={0} isCompleted={false} isFinalStep={false} onComplete={onComplete}>
        Content
      </StepCard>
    );
    expect(screen.getByText('Listo, ya lo hice')).toBeDefined();
  });

  it('clicking "Listo, ya lo hice" calls onComplete callback', () => {
    const onComplete = vi.fn();
    render(
      <StepCard stepIndex={0} isCompleted={false} isFinalStep={false} onComplete={onComplete}>
        Content
      </StepCard>
    );
    fireEvent.click(screen.getByText('Listo, ya lo hice'));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows completed state with Check icon when step is done', () => {
    const onComplete = vi.fn();
    render(
      <StepCard stepIndex={0} isCompleted={true} isFinalStep={false} onComplete={onComplete}>
        Content
      </StepCard>
    );
    // Button still shows but with pointer-events-none (completed style)
    const button = screen.getByRole('button');
    expect(button.className).toContain('pointer-events-none');
  });

  it('completed button shows "Listo, ya lo hice" text with disabled style', () => {
    const onComplete = vi.fn();
    render(
      <StepCard stepIndex={0} isCompleted={true} isFinalStep={false} onComplete={onComplete}>
        Content
      </StepCard>
    );
    expect(screen.getByText('Listo, ya lo hice')).toBeDefined();
    const button = screen.getByRole('button');
    expect(button.className).toContain('pointer-events-none');
  });

  it('calls onLevelComplete when final step is completed', () => {
    const onComplete = vi.fn();
    const onLevelComplete = vi.fn();
    render(
      <StepCard
        stepIndex={2}
        isCompleted={false}
        isFinalStep={true}
        onComplete={onComplete}
        onLevelComplete={onLevelComplete}
      >
        Content
      </StepCard>
    );
    fireEvent.click(screen.getByText('Listo, ya lo hice'));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onLevelComplete).toHaveBeenCalledTimes(1);
  });
});
