import { useState } from "react";
import styles from "./LoginModal.module.css";
import { IoClose } from 'react-icons/io5'
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginModal({ open, onClose, onLogin }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!open) return null
 
  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <IoClose />
        </button>
        <h2 className={styles.title}>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.icon}/>
            <input 
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.icon}/>
            <input 
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
          <p className={styles.noAccount}><small>Don't have an account? <span><a className={styles.signUp}>Sign up</a></span></small></p>
        </form>
      </div>
    </div>
  )
}
