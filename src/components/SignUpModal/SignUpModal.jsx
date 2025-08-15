import { useState, useEffect, useRef } from 'react'
import styles from './SignUpModal.module.css'
import socialLoginStyles from "../../styles/socialLogin.module.css"
import { IoClose } from 'react-icons/io5'
import { FaUser, FaLock, FaUnlock, FaGoogle, FaGithub } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUpModal({ open, onClose, onSignup, onSwitchToLogin, onGoogleLogin, onGitHubLogin, ...rest }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const usernameInputRef = useRef(null)

  // Always render the component but control visibility with `open` prop
  useEffect(() => {
    if (open && usernameInputRef.current) {
      usernameInputRef.current.focus()
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Signed up user:', user)

      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      })

      if (onSignup) {
        onSignup(username, email)
      }

      if (onClose) {
        console.log('Closing modal...')
        onClose()
      }
    } catch (err) {
      console.log(err)
      if (err.message === "Firebase: Error (auth/invalid-email).") {
        setError("Please enter a valid email address")
      } else if (err.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("Email is already in use")
      } else if (err.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
        setError("Password must be at least 6 characters long")
      } else {
        setError(err.message)
      }
    }
  }

  if (!open) return null;

  return (
    <div
      {...rest}
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
      aria-hidden={!open}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sign up modal"
        >
          <IoClose />
        </button>

        <img className={styles.logo} src="/images/EsdbRel.png" alt="Esdb Logo" />

        <h2 className={styles.title} id="signup-title">Create Account</h2>

        <p id="signup-description" className={styles.SROnly}>
          Please enter your username, email, and password to create a new account.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="signup-username" id="label-username">Username</label>
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} aria-hidden="true" />
              <input
                id="signup-username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                value={username}
                className={styles.input}
                onChange={(e) => setUsername(e.target.value)}
                required
                ref={usernameInputRef}
                aria-labelledby="label-username"
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-email" id="label-email">Email</label>
            <div className={styles.inputGroup}>
              <IoMdMail className={styles.icon} aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                className={styles.input}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-labelledby="label-email"
                aria-describedby="email-helper"
              />
            </div>
            <p id="email-helper" className={styles.SROnly}>
              Enter a valid email address to sign up.
            </p>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-password" id="label-password">Password</label>
            <div className={styles.inputGroup}>
              <FaUnlock className={styles.icon} aria-hidden="true" />
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-labelledby="label-password"
                aria-describedby="password-helper"
              />
            </div>
            <p id="password-helper" className={styles.SROnly}>
              Password must be at least 6 characters long.
            </p>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-confirm-password" id="label-confirm-password">Confirm Password</label>
            <div className={styles.inputGroup}>
              <FaLock className={styles.icon} aria-hidden="true" />
              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                className={styles.input}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-labelledby="label-confirm-password"
                aria-describedby="confirm-password-helper"
              />
            </div>
            <p id="confirm-password-helper" className={styles.SROnly}>
              Re-enter your password to confirm.
            </p>
          </div>

          {error && <p className={styles.errorMessage} role="alert" aria-live="assertive">{error}</p>}

          <button type="submit" className={styles.submitButton} aria-label="Submit sign-up form">
            Sign Up
          </button>
        </form>

        <p className={styles.switchText}>
          <small>
            Already have an account?{' '}
            <button
              type="button"
              className={styles.signIn}
              onClick={onSwitchToLogin}
              aria-label="Switch to login form"
            >
              Sign in
            </button>
          </small>
        </p>

        <button className={socialLoginStyles.socialLoginBtn}onClick={onGoogleLogin}>
          <span className={socialLoginStyles.socialIcon}><FaGoogle /></span>
          Sign up with Google
        </button>

        <button className={`${socialLoginStyles.socialLoginBtn} ${socialLoginStyles.marginTop}`} onClick={onGitHubLogin}>
          <span className={socialLoginStyles.socialIcon}><FaGithub /></span>
          Sign up with GitHub
        </button>

      </div>
    </div>
  )
}
