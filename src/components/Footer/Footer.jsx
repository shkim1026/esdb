import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.gridRow}>
                <img src="/images/EsdbLogo.png" className={styles.logo}/>
                <div className={styles.flexColumn}>
                    <Link href="/faq">FAQ</Link>
                    <Link href="/terms">Terms of Use</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/contact">Contact</Link>
                </div>
                <div>
                    <p className={styles.disclaimer}>
                        This website is a personal project created solely for the purpose of showcasing frontend development skills 
                        using React. It is not affiliated with, endorsed by, or connected to TMDB, Netflix, or any other streaming service. All 
                        data displayed is for demonstration purposes only.
                    </p>
                    <p>No files are hosted on this website's servers. All media content is accessed via links to third-party services.</p>
                </div>
            </div>
            <div>
                <p className={styles.copyright}>© 2025 Entertainment Streaming Database</p>
            </div>
        </footer>
    )
}