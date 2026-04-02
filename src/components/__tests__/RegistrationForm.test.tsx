import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RegistrationForm } from '../RegistrationForm';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the server action
vi.mock('@/app/actions', () => ({
  registerUser: vi.fn(),
}));

// Mock session helpers
vi.mock('@/lib/session', () => ({
  setSessionId: vi.fn(),
}));

describe('RegistrationForm', () => {
  it('renders three input fields (name, linkedinUrl, email)', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/nombre/i)).toBeDefined();
    expect(screen.getByLabelText(/perfil de linkedin/i)).toBeDefined();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
  });

  it('renders a submit button with text "Comenzar Tutorial"', () => {
    render(<RegistrationForm />);

    expect(screen.getByRole('button', { name: /comenzar tutorial/i })).toBeDefined();
  });

  it('name and linkedinUrl inputs have required attribute', () => {
    render(<RegistrationForm />);

    const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    const linkedinInput = screen.getByLabelText(/perfil de linkedin/i) as HTMLInputElement;

    expect(nameInput.required).toBe(true);
    expect(linkedinInput.required).toBe(true);
  });

  it('email input does not have required attribute', () => {
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.required).toBe(false);
  });
});
