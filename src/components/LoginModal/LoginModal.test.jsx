import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginModal from './LoginModal'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/firebase'

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}))
jest.mock('../../../firebase/firebase', () => ({
  auth: {},
}))

describe('LoginModal', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: jest.fn(),
      onLogin: jest.fn(),
      onSwitchToSignup: jest.fn(),
      onGoogleLogin: jest.fn(),
      onGitHubLogin: jest.fn(),
      ...props,
    }
    render(<LoginModal {...defaultProps} />)
    return defaultProps
  }

  it('renders modal content when open', () => {
    setup()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with GitHub' })).toBeInTheDocument();
  })

  it('autofocuses email input when open', () => {
    setup()
    const emailInput = screen.getByLabelText(/email/i)
    expect(document.activeElement).toBe(emailInput)
  })

  it('calls onLogin on successful login', async () => {
    const mockUser = { user: { uid: 'abc123' } }
    signInWithEmailAndPassword.mockResolvedValueOnce(mockUser)
    const { onLogin } = setup()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /submit login/i }))

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
      expect(onLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error on login failure', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'))
    setup()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /submit login/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/invalid email and\/or password/i)
  })

  it('calls onClose when close button is clicked', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByLabelText(/close sign-in modal/i))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onSwitchToSignup when sign up button is clicked', () => {
    const { onSwitchToSignup } = setup()
    fireEvent.click(screen.getByRole('button', { name: /switch to sign-up form/i }))
    expect(onSwitchToSignup).toHaveBeenCalled()
  })

  it('calls onGoogleLogin when Google login button is clicked', () => {
    const { onGoogleLogin } = setup()
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))
    expect(onGoogleLogin).toHaveBeenCalled()
  })

  it('calls onGitHubLogin when GitHub login button is clicked', () => {
    const { onGitHubLogin } = setup()
    fireEvent.click(screen.getByRole('button', { name: /sign in with github/i }))
    expect(onGitHubLogin).toHaveBeenCalled()
  })
})
