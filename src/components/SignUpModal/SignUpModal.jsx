import { useState, useEffect, useRef } from 'react'
import styles from './SignUpModal.module.css'
import socialLoginStyles from "../../styles/socialLogin.module.css"
import { IoClose } from 'react-icons/io5'
import { FaUser, FaLock, FaUnlock, FaGoogle, FaGithub } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'

export default function SignUpModal({ open, onClose, onSignup, onSwitchToLogin, onGoogleLogin, onGitHubLogin }) {
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
    setError(&apos;&apos;)

    if (password !== confirmPassword) {
      setError(&apos;Passwords do not match!&apos;)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log(&apos;Signed up user:&apos;, user)

      await setDoc(doc(db, &apos;users&apos;, user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      })

      if (onSignup) {
        onSignup(username, email)
      }

      if (onClose) {
        console.log(&apos;Closing modal...&apos;)
        onClose()
      }
    } catch (err) {
      console.log(err)
      if (err.message === &quot;Firebase: Error (auth/invalid-email).&quot;) {
        setError(&quot;Please enter a valid email address&quot;)
      } else if (err.message === &quot;Firebase: Error (auth/email-already-in-use).&quot;) {
        setError(&quot;Email is already in use&quot;)
      } else if (err.message === &quot;Firebase: Password should be at least 6 characters (auth/weak-password).&quot;){
        setError(&quot;Password must be at least 6 characters long&quot;)
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div
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
                ref={usernameInputRef}
                aria-labelledby=&quot;signup-username&quot;
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
                aria-labelledby=&quot;signup-email&quot;
                aria-describedby=&quot;email-helper&quot;
              />
            </div>
            <p id="email-helper" className={styles.SROnly}>
              Enter a valid email address to sign up.
            </p>
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
                aria-labelledby=&quot;signup-password&quot;
                aria-describedby=&quot;password-helper&quot;
              />
            </div>
            <p id="password-helper" className={styles.SROnly}>
              Password must be at least 6 characters long.
            </p>
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
                aria-labelledby=&quot;signup-confirm-password&quot;
                aria-describedby=&quot;confirm-password-helper&quot;
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
            Already have an account?{&apos; &apos;}
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
