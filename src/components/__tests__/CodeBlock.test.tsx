import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CodeBlock } from '../tutorial/CodeBlock';

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
  });
});

describe('CodeBlock', () => {
  it('renders code content in monospace font', () => {
    render(<CodeBlock code="claude --help" />);
    expect(screen.getByText('claude --help')).toBeInTheDocument();
  });

  it('renders copy button with Copy icon', () => {
    render(<CodeBlock code="claude --help" />);
    const button = screen.getByRole('button', { name: 'Copiar código' });
    expect(button).toBeInTheDocument();
  });

  it('clicking copy button calls navigator.clipboard.writeText with code content', async () => {
    render(<CodeBlock code="claude --help" />);
    const button = screen.getByRole('button', { name: 'Copiar código' });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('claude --help');
  });

  it('shows Check icon for 2 seconds after successful copy', async () => {
    render(<CodeBlock code="claude --help" />);
    const button = screen.getByRole('button', { name: 'Copiar código' });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole('button', { name: 'Código copiado' })).toBeInTheDocument();
  });

  it('copy button has aria-label "Copiar código"', () => {
    render(<CodeBlock code="some code" />);
    expect(screen.getByRole('button', { name: 'Copiar código' })).toBeInTheDocument();
  });

  it('after copy, aria-label changes to "Código copiado"', async () => {
    render(<CodeBlock code="some code" />);
    const button = screen.getByRole('button', { name: 'Copiar código' });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole('button', { name: 'Código copiado' })).toBeInTheDocument();
  });
});
