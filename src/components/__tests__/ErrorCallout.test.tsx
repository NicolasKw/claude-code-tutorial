import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorCallout } from '../tutorial/ErrorCallout';

describe('ErrorCallout', () => {
  const defaultProps = {
    trigger: 'Si ves este error',
    error: 'command not found: claude',
    solution: 'Ejecuta npm install -g @anthropic-ai/claude-code para instalar Claude Code',
  };

  it('renders a details element', () => {
    const { container } = render(<ErrorCallout {...defaultProps} />);
    const details = container.querySelector('details');
    expect(details).toBeInTheDocument();
  });

  it('summary contains trigger and error text joined by " — "', () => {
    render(<ErrorCallout {...defaultProps} />);
    const summary = screen.getByRole('group');
    // details element acts as a group; check via text content
    expect(summary.querySelector('summary')).toHaveTextContent(
      `${defaultProps.trigger} — ${defaultProps.error}`
    );
  });

  it('expanded content contains solution text', () => {
    const { container } = render(<ErrorCallout {...defaultProps} />);
    const details = container.querySelector('details');
    expect(details).toHaveTextContent(defaultProps.solution);
  });

  it('has amber background styling (bg-amber-50 class)', () => {
    const { container } = render(<ErrorCallout {...defaultProps} />);
    const details = container.querySelector('details');
    expect(details).toHaveClass('bg-amber-50');
  });
});
