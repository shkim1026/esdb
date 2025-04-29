import styles from '../../styles/infoLayout.module.css'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Head from 'next/head'

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact</title>
                <meta name="description" content="Get in touch for collaborations, questions, or just to say hello. I'd love to hear from you!" />
            </Head>
            <section className={styles.section} aria-labelledby="contact-heading">
                <h1 id="contact-heading" className={styles.title}>Contact</h1>

                <p className={styles.textCenter}>
                    Have questions about this project?
                    <br />Want to chat about frontend development, React, or potential job opportunities? 
                    <br />I'd love to hear from you!
                </p>

                <ul className={styles.contactList} role="list">
                    <li>
                        <h2>Email</h2>
                        <div className={styles.iconWrapper}>
                            <a 
                                href="mailto:shkim1026@gmail.com" 
                                aria-label="Send an email to shkim1026@gmail.com"
                            >
                                <SiGmail className={styles.contactIcon} />
                            </a>
                            <div className={styles.tooltip} role="tooltip">shkim1026@gmail.com</div>
                        </div>
                    </li>

                    <li>
                        <h2>LinkedIn</h2>
                        <div className={styles.iconWrapper}>
                            <a 
                                href="https://www.linkedin.com/in/shkim1026/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Visit LinkedIn profile"
                            >
                                <FaLinkedin className={styles.contactIcon} />
                            </a>
                            <div className={styles.tooltip} role="tooltip">https://www.linkedin.com/in/shkim1026/</div>
                        </div>
                    </li>

                    <li>
                        <h2>GitHub</h2>
                        <div className={styles.iconWrapper}>
                            <a 
                                href="https://github.com/shkim1026" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Visit GitHub profile"
                            >
                                <FaGithub className={styles.contactIcon} />
                            </a>
                            <div className={styles.tooltip} role="tooltip">https://github.com/shkim1026</div>
                        </div>
                    </li>
                </ul>
            </section>
        </>
    );
}
