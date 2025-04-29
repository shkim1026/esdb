import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} aria-label="Site footer">
            <div className={styles.gridRow}>
                <img 
                    src="/images/EsdbLogo.png" 
                    className={styles.logo} 
                    alt="Entertainment Streaming Database logo" 
                />
                <nav className={styles.flexColumn} aria-label="Footer navigation links">
                    <Link href="/faq">FAQ</Link>
                    <Link href="/terms">Terms of Use</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
                <div>
                    <p className={styles.disclaimer}>
                        This website is a personal project created solely for the purpose of showcasing frontend development skills 
                        using React. It is not affiliated with or endorsed by TMDB, Netflix, or any other streaming service. All 
                        data displayed is for demonstration purposes only.
                    </p>
                    <p className={styles.hostingDisclaimer}>
                        No files are hosted on this website's servers. All media content is accessed via links to third-party services.
                    </p>
                </div>
            </div>
            <div>
                <p className={styles.copyright}>
                    © 2025 Entertainment Streaming Database
                </p>
            </div>
        </footer>
    );
}
