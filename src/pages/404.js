import Link from 'next/link';
import styles from './404.module.css';

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>404</h1>
      <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <button className={styles.button}>Go back home</button>
      </Link>
    </div>
  )
}
