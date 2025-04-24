import styles from '../../styles/infoLayout.module.css'

export default function Privacy() {
    return (
        <section className={styles.section}>
            <h1 className={styles.title}>Privacy Policy</h1>
                <h4>Last updated: [April 24, 2025]</h4>
                <p>
                This Privacy Policy explains how your information is collected, used, and protected when using this 
                application ("App"). This App is a personal portfolio project built and maintained by Steven H. Kim, and is not 
                affiliated with TMDB, VidSrc, or Netflix, Inc.
                </p>
            <hr/>
            <ol className={styles.ulContainer}>
                <li>
                    <h4>Information Collected</h4>
                    <p>This App collects the following information when you choose to create your account:</p>
                    <ul>
                        <li><strong>Email address</strong> - Used for authentication via Firebase Auth</li>
                        <li><strong>Favorites</strong> - Stored in Firestore, linked to your Firebase UID</li>
                    </ul>
                    <p>
                        No other personal information is collected, and you are not required to provide any sensitive or identifying details 
                        to use the basic features of the App.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>How Your Data is Used</h4>
                    <p>Your data is used solely to:</p>
                    <ul className={styles.questionUl}>
                        <li>Authenticate your login and enable session-based features.</li>
                        <li>Store and retrieve your personalized list of saved movies or shows.</li>
                    </ul>
                    <p>Your data is not sold, rented, or shared with any third parties.</p>
                </li>
                <hr/>
                <li>
                    <h4>Third-Party Services</h4>
                    <p>This App uses the following third-party services:</p>
                    <ul className={styles.questionUl}>
                        <li><strong>Firebase Authentication & Firestore</strong> - For user login and database storage.</li>
                        <li><strong>TMDB API</strong> - To retrieve movie and TV show data. No user data is sent to TMDB.</li>
                        <li><strong>VidSrc API</strong> - To retrieve movie and TV media content. No user data is sent to VidSrc.</li>
                    </ul>
                    <p>
                        These services may collect anonymized usage data as part of their own operations. Please refer to their respective 
                        privacy policies for more information.
                    </p>
                    <ul>
                        <li><a href="https://firebase.google.com/support/privacy">Firebase Privacy Policy</a></li>
                        <li><a href="https://www.themoviedb.org/privacy-policy">TMDB Privacy Policy</a></li>
                        <li><a href="https://vidsrc.community/help/privacy-policy/">VidSrc Privacy Policy</a></li>
                    </ul>
                </li>
                <hr/>
                <li>
                    <h4>Data Security</h4>
                    <p>
                        All user data is stored using Firebase's secure cloud infrastructure. While best efforts are made to ensure 
                        data security, this is a demonstration project and should not be used for sensitive or critical information.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Data Retention</h4>
                    <p>
                        User data is retained in Firestore as long as your account remains active. You can request deletion of your 
                        data by contacting the developer (see contact below).
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Children's Privacy</h4>
                    <p>
                        This App is not intended for children under the age of 13. No personally identifiable information is 
                        knowingly collected from children.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Changes to This Policy</h4>
                    <p>
                        This Privacy Policy may be updated at any time. Updates will be posted on this page with a new revision date.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Contact</h4>
                    <p>
                        For questions, concerns, or data removal requests, please contact the developer at: <strong>shkim1026@gmail.com</strong>
                    </p>
                </li>
            </ol>
        </section>
    )
}