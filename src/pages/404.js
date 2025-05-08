import Link from 'next/link';
import styles from './404.module.css';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404: Page not found</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
      </Head>
      <div className={styles.container} role="main" aria-labelledby="error-heading">
        <h1 id="error-heading" className={styles.heading}>
          404
        </h1>
        <p className={styles.message} role="alert">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <button className={styles.button} aria-label="Go back to the home page">
            Go back home
          </button>
        </Link>
      </div>
    </>
  );
}

