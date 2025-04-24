import styles from '../../styles/infoLayout.module.css'

export default function Terms() {
    return (
        <section className={styles.section}>
            <h1 className={styles.title}>Terms of Use</h1>
                <h4>Last updated: [April 24, 2025]</h4>
                <p>
                    Welcome to the Entertainment Streaming Database ("App"), developed and maintained as a portfolio project 
                    by Steven H. Kim. By accessing or using this App, you agree to the following terms and conditions. 
                    If you do not agree with these terms, please do not use the App.
                </p>
            <hr/>
            <ol className={styles.ulContainer}>
                <li>
                    <h4>Purpose of the App</h4>
                    <p>
                    This App is a personal, non-commercial portfolio project designed to showcase frontend development skills. 
                    It is not affiliated with, endorsed by, or connected in any way to Netflix, The Movie Database (TMDB), or VidSrc. 
                    All media and branding are used strictly for educational and demonstrative purposes.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Use of the App</h4>
                    <p>You may use this App solely for personal, non-commercial viewing and evaluation. You agree <strong>not</strong> to:</p>
                    <ul className={styles.questionUl}>
                        <li>Copy, distribute, or reverse-engineer any part of the codebase.</li>
                        <li>Use the App in any way that violates applicable laws or third-party rights.</li>
                        <li>Attempt to bypass authentication or misuse user-specific features.</li>
                    </ul>
                </li>
                <hr/>
                <li>
                    <h4>Content Disclaimer</h4>
                    <p>
                        All movie and TV show data (titles, descriptions, images) is provided by The Movie Database (TMDB). All streaming
                        data is provided by VidSrc. The developer does not claim ownership over this content. Any copyrighted material 
                        remains the property of its respective owners.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>No Warranties</h4>
                    <p>
                        This App is provided "as-is" without warranties of any kind. While the developer has made efforts to ensure 
                        functionality and stability, there are no guarantees regarding uptime, data accuracy, or performance.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>User Data</h4>
                    <p>
                        If you choose to sign up, your email and any favorites you save may be stored securely using Firebase 
                        Authentication and Firestore. This data is not shared or sold. As this is a demo project, you should 
                        avoid entering sensitive or personal information.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Limitations of Liability</h4>
                    <p>
                        The developer is not responsible for any damages or losses resulting from the use or misuse of this App, 
                        including but not limited to data loss, application errors, or third-party service outages.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Changes to Terms</h4>
                    <p>
                        These Terms of Use may be updated at any time. Any changes will be reflected on this page with an updated 
                        revision date.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Contact</h4>
                    <p>
                        If you have questions or concerns about these Terms of Use, you can contact the developer at 
                        shkim1026@gmail.com
                    </p>
                </li>
            </ol>
        </section>
    )
}