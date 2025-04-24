import styles from '../../styles/infoLayout.module.css'

export default function FAQ() {
    return (
        <section className={styles.section}>
            <h1 className={styles.title}>F.A.Q.</h1>
            <ul className={styles.ulContainer}>
                <li>
                    <h4>Brief Overview:</h4>
                    <p>
                        This is a Netflix-inspired streaming app clone build using React. It uses the TMDB API for movie and TV data, 
                        VidSrc API for the media content, and Firebase for authentication and user data (favorites). 
                        It was build solely to demonstrate my frontend development skills in a real-world scenario.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>Technologies used:</h4>
                    <ul className={styles.questionUl}>
                        <li><strong>React</strong> - Component-based, scalable UI</li>
                        <li><strong>Next.js</strong> - Server-side rendering and static site generation</li>
                        <li><strong>Firebase Auth + Firestore</strong> - Fast setup for authentication and realtime data syncing</li>
                        <li><strong>TMDB API</strong> - Public API with rich movie & TV data</li>
                        <li><strong>VidSrc API</strong> - Public API with a vast array of embeddable links for streaming</li>
                    </ul>
                </li>
                <hr/>
                <li>
                    <h4>How is the project structured?</h4>
                    <p>
                        This project uses a modular structure, with reusable UI components in a '/components' folder and page-specific
                        logic split into '/pages'. Global state (user, favorites) is managed using custom hooks.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>How does authentication work?</h4>
                    <p>
                        Users can sign up and log in using their email and password through Firebase Auth. Once logged in, their favorites
                        are stored in Firestore and linked to their UID.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>What features are connected to user data?</h4>
                    <p>
                        Logged-in users can add or remove favorites from their personal "My List", change their username, and 
                        change their email address (after verification) which is stored in Firebase and retrieved on each visit.
                    </p>
                </li>
                <hr/>
                <li>
                    <h4>What features could be added in the future?</h4>
                    <ul className={styles.questionUl}>
                        <li>Social logins (Google, Github)</li>
                        <li>User reviews & ratings</li>
                        <li>Continue Watching section</li>
                        <li>Light & dark mode toggle</li>
                        <li>Unit/integration testing with Jest + React Testing Library</li>
                    </ul>
                </li>
            </ul>
        </section>
    )
}