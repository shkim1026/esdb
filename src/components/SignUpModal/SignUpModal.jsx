import { useState } from 'react'
import styles from './SignUpModal.module.css'
import { IoClose } from 'react-icons/io5'
import { FaUser, FaLock, FaUnlock } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUpModal({ open, onClose, onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

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

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label htmlFor="signup-username">Username</label>
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
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-email">Email</label>
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
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-password">Password</label>
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
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="signup-confirm-password">Confirm Password</label>
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
              />
            </div>
          </div>

          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <button type="submit" className={styles.submitButton}>
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
      </div>
    </div>
  )
}
