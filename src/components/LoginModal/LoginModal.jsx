import { useState } from "react";
import styles from "./LoginModal.module.css";
import { IoClose } from 'react-icons/io5';
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginModal({ open, onClose, onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close sign-in modal"
        >
          <IoClose />
        </button>

        <img
          className={styles.logo}
          src="/images/EsdbRel.png"
          alt="Esdb Logo"
        />

        <h2 id="login-modal-title" className={styles.title}>Sign In</h2>

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

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>

          <p className={styles.noAccount}>
            <small>
              Don't have an account?{" "}
              <button
                type="button"
                className={styles.signUp}
                onClick={onSwitchToSignup}
                aria-label="Switch to sign-up form"
              >
                Sign up
              </button>
            </small>
          </p>
        </form>
      </div>
    </div>
  );
}
