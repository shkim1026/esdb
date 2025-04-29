import styles from '../../styles/infoLayout.module.css'
import Head from "next/head"

export default function Privacy() {
    return (
        <>
        <Head>
            <title>Privacy Policy</title>
            <meta 
                name="description" 
                content="Read the Privacy Policy for this portfolio streaming app project, explaining how your data is collected, used, and protected when using the site." 
            />
        </Head>
        <main role="main" className={styles.section} aria-labelledby="privacy-title">
            <h1 id="privacy-title" className={styles.title}>Privacy Policy</h1>
            <p><strong>Last updated:</strong> <time dateTime="2025-04-24">April 24, 2025</time></p>
            <p>
                This Privacy Policy explains how your information is collected, used, and protected when using this 
                application ("App"). This App is a personal portfolio project built and maintained by Steven H. Kim, and is not 
                affiliated with TMDB, VidSrc, or Netflix, Inc.
            </p>
            <hr aria-hidden="true" />
            <ol className={styles.ulContainer}>
                <li>
                    <section aria-labelledby="info-collected-heading">
                        <h2 id="info-collected-heading">Information Collected</h2>
                        <p>This App collects the following information when you choose to create your account:</p>
                        <ul>
                            <li><strong>Email address</strong> - Used for authentication via Firebase Auth</li>
                            <li><strong>Favorites</strong> - Stored in Firestore, linked to your Firebase UID</li>
                        </ul>
                        <p>
                            No other personal information is collected, and you are not required to provide any sensitive or identifying details 
                            to use the basic features of the App.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="data-use-heading">
                        <h2 id="data-use-heading">How Your Data is Used</h2>
                        <p>Your data is used solely to:</p>
                        <ul className={styles.questionUl}>
                            <li>Authenticate your login and enable session-based features.</li>
                            <li>Store and retrieve your personalized list of saved movies or shows.</li>
                        </ul>
                        <p>Your data is not sold, rented, or shared with any third parties.</p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="third-party-heading">
                        <h2 id="third-party-heading">Third-Party Services</h2>
                        <p>This App uses the following third-party services:</p>
                        <ul className={styles.questionUl}>
                            <li><strong>Firebase Authentication & Firestore</strong> - For user login and database storage.</li>
                            <li><strong>TMDB API</strong> - To retrieve movie and TV show data. No user data is sent to TMDB.</li>
                            <li><strong>VidSrc API</strong> - To retrieve movie and TV media content. No user data is sent to VidSrc.</li>
                        </ul>
                        <p>
                            These services may collect anonymized usage data as part of their own operations. Please refer to their respective 
                            privacy policies for more information:
                        </p>
                        <ul>
                            <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a></li>
                            <li><a href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer">TMDB Privacy Policy</a></li>
                            <li><a href="https://vidsrc.community/help/privacy-policy/" target="_blank" rel="noopener noreferrer">VidSrc Privacy Policy</a></li>
                        </ul>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="security-heading">
                        <h2 id="security-heading">Data Security</h2>
                        <p>
                            All user data is stored using Firebase's secure cloud infrastructure. While best efforts are made to ensure 
                            data security, this is a demonstration project and should not be used for sensitive or critical information.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="retention-heading">
                        <h2 id="retention-heading">Data Retention</h2>
                        <p>
                            User data is retained in Firestore as long as your account remains active. You can request deletion of your 
                            data by contacting the developer (see contact below).
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="children-heading">
                        <h2 id="children-heading">Children's Privacy</h2>
                        <p>
                            This App is not intended for children under the age of 13. No personally identifiable information is 
                            knowingly collected from children.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="changes-policy-heading">
                        <h2 id="changes-policy-heading">Changes to This Policy</h2>
                        <p>
                            This Privacy Policy may be updated at any time. Updates will be posted on this page with a new revision date.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="contact-heading">
                        <h2 id="contact-heading">Contact</h2>
                        <p>
                            For questions, concerns, or data removal requests, please contact the developer at: 
                            {" "}<a href="mailto:shkim1026@gmail.com">shkim1026@gmail.com</a>
                        </p>
                    </section>
                </li>
            </ol>
        </main>
        </>
    )
}
