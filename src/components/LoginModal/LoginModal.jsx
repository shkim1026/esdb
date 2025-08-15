import { useState, useEffect, useRef } from "react";
import styles from "./LoginModal.module.css";
import socialLoginStyles from "../../styles/socialLogin.module.css"
import { IoClose } from 'react-icons/io5';
import { FaUser, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export default function LoginModal({ 
  open, 
  onClose, 
  onLogin, 
  onSwitchToSignup, 
  onGoogleLogin, 
  onGitHubLogin,
  closeTestId, 
  switchTestId,
  submitLogin,
  googleSignIn,
  ...rest
}) 
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (open && emailInputRef.current) {
      emailInputRef.current.focus(); // Focus the input when modal is opened
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (onLogin) {
        onLogin(email, password);
      }
    } catch (err) {
      console.log(err.message);
      setError("Invalid email and/or password");
    }
  };

  if (!open) return null;

  return (
    <div
      {...rest}
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sign-in modal"
          data-testid={closeTestId}
        >
          <IoClose />
        </button>

        <img
          className={styles.logo}
          src="/images/EsdbRel.png"
          alt="Esdb Logo"
        />

        <h2 id="login-modal-title" className={styles.title}>Sign In</h2>
        <p id="login-modal-description" className={styles.SROnly}>
          Please enter your email and password to sign in.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="login-email">Email</label>
            <div className={styles.inputWrapper}>
              <FaUser className={styles.icon} aria-hidden="true"/>
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                ref={emailInputRef}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="login-password">Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.icon} aria-hidden="true"/>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className={styles.errorMessage} role="alert">{error}</p>}

          <button 
            type="submit" 
            className={styles.submitButton} 
            aria-label="submit login"
            data-testid={submitLogin}
          >
            Sign In
          </button>
        </form>

        <p className={styles.noAccount}>
            <small>
              Don't have an account?{" "}
              <button
                data-testid={switchTestId}
                type="button"
                className={styles.signUp}
                onClick={onSwitchToSignup}
                aria-label="Switch to sign-up form"
              >
                Sign up
              </button>
            </small>
        </p>

        <button className={socialLoginStyles.socialLoginBtn} onClick={onGoogleLogin} data-testid={googleSignIn}>
          <span className={socialLoginStyles.socialIcon}><FaGoogle /></span>
          Sign in with Google
        </button>

        <button className={`${socialLoginStyles.socialLoginBtn} ${socialLoginStyles.marginTop}`} onClick={onGitHubLogin}>
          <span className={socialLoginStyles.socialIcon}><FaGithub /></span>
          Sign in with GitHub
        </button>

      </div>
    </div>
  );
}
