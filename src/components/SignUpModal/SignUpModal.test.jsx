import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpModal from './SignUpModal';

jest.mock('../../../firebase/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('SignUpModal', () => {
  const onClose = jest.fn();
  const onSignup = jest.fn();
  const onSwitchToLogin = jest.fn();
  const onGoogleLogin = jest.fn();
  const onGitHubLogin = jest.fn();

  beforeEach(() => {
    render(
      <SignUpModal
        open={true}
        onClose={onClose}
        onSignup={onSignup}
        onSwitchToLogin={onSwitchToLogin}
        onGoogleLogin={onGoogleLogin}
        onGitHubLogin={onGitHubLogin}
      />
    );
  });

  it('renders all form fields and buttons', () => {
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit sign-up form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to login form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign up with google$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign up with github$/i })).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'tester' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'tester@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /submit sign-up form/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');
    });
  });

  it('calls social login handlers', () => {
    fireEvent.click(screen.getByRole('button', { name: /^sign up with google$/i }));
    expect(onGoogleLogin).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /^sign up with github$/i }));
    expect(onGitHubLogin).toHaveBeenCalled();
  });

  it('calls switch to login handler', () => {
    fireEvent.click(screen.getByRole('button', { name: /switch to login form/i }));
    expect(onSwitchToLogin).toHaveBeenCalled();
  });
});
