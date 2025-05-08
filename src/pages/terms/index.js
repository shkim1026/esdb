import styles from '../../styles/infoLayout.module.css'
import Head from 'next/head'

export default function Terms() {
    return (
        <>
        <Head>
            <title>Terms of Use</title>
            <meta 
                name="description" 
                content="Read the Terms of Use for this Entertainment Streaming Database portfolio project, covering permitted usage, content ownership, data policies, and disclaimers." 
            />
        </Head>
        <main role="main" className={styles.section} aria-labelledby="terms-title">
            <h1 id="terms-title" className={styles.title}>Terms of Use</h1>
            <p><strong>Last updated:</strong> <time dateTime="2025-04-24">April 24, 2025</time></p>
            <p>
                Welcome to the Entertainment Streaming Database (&quot;App&quot;), developed and maintained as a portfolio project 
                by Steven H. Kim. By accessing or using this App, you agree to the following terms and conditions. 
                If you do not agree with these terms, please do not use the App.
            </p>
            <hr aria-hidden="true" />
            <ol className={styles.ulContainer}>
                <li>
                    <section aria-labelledby="purpose-heading">
                        <h2 id="purpose-heading">Purpose of the App</h2>
                        <p>
                            This App is a personal, non-commercial portfolio project designed to showcase frontend development skills. 
                            It is not affiliated with, endorsed by, or connected in any way to Netflix, The Movie Database (TMDB), or VidSrc. 
                            All media and branding are used strictly for educational and demonstrative purposes.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="use-heading">
                        <h2 id="use-heading">Use of the App</h2>
                        <p>You may use this App solely for personal, non-commercial viewing and evaluation. You agree <strong>not</strong> to:</p>
                        <ul className={styles.questionUl}>
                            <li>Copy, distribute, or reverse-engineer any part of the codebase.</li>
                            <li>Use the App in any way that violates applicable laws or third-party rights.</li>
                            <li>Attempt to bypass authentication or misuse user-specific features.</li>
                        </ul>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="disclaimer-heading">
                        <h2 id="disclaimer-heading">Content Disclaimer</h2>
                        <p>
                            All movie and TV show data (titles, descriptions, images) is provided by The Movie Database (TMDB). All streaming
                            data is provided by VidSrc. The developer does not claim ownership over this content. Any copyrighted material 
                            remains the property of its respective owners.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="warranties-heading">
                        <h2 id="warranties-heading">No Warranties</h2>
                        <p>
                            This App is provided &quot;as-is&quot; without warranties of any kind. While the developer has made efforts to ensure 
                            functionality and stability, there are no guarantees regarding uptime, data accuracy, or performance.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="user-data-heading">
                        <h2 id="user-data-heading">User Data</h2>
                        <p>
                            If you choose to sign up, your email and any favorites you save may be stored securely using Firebase 
                            Authentication and Firestore. This data is not shared or sold. As this is a demo project, you should 
                            avoid entering sensitive or personal information.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="liability-heading">
                        <h2 id="liability-heading">Limitations of Liability</h2>
                        <p>
                            The developer is not responsible for any damages or losses resulting from the use or misuse of this App, 
                            including but not limited to data loss, application errors, or third-party service outages.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="changes-heading">
                        <h2 id="changes-heading">Changes to Terms</h2>
                        <p>
                            These Terms of Use may be updated at any time. Any changes will be reflected on this page with an updated 
                            revision date.
                        </p>
                    </section>
                </li>
                <hr aria-hidden="true" />
                <li>
                    <section aria-labelledby="contact-heading">
                        <h2 id="contact-heading">Contact</h2>
                        <p>
                            If you have questions or concerns about these Terms of Use, you can contact the developer at 
                            {&quot; &quot;}<a href="mailto:shkim1026@gmail.com">shkim1026@gmail.com</a>
                        </p>
                    </section>
                </li>
            </ol>
        </main>
        </>
    )
}
