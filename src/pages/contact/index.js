import styles from '../../styles/infoLayout.module.css'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Contact() {
    return (
        <section className={styles.section}>
            <h1 className={styles.title}>Contact</h1>
            <p className={styles.textCenter}>
                Have questions about this project?
                <br/>Want to chat about frontend development, React, or potential job opportunities? 
                <br/>I'd love to hear from you!
            </p>
            <ul className={styles.contactList}>
                <li><h2>Email</h2>
                    <a href="mailto:shkim1026@gmail.com"><SiGmail className={styles.contactIcon}/></a>
                </li>
                <li><h2>LinkedIn</h2>
                    <a href="https://www.linkedin.com/in/shkim1026/"><FaLinkedin className={styles.contactIcon}/></a>
                </li>
                <li><h2>Github</h2>
                    <a href="https://github.com/shkim1026"><FaGithub className={styles.contactIcon}/></a>
                </li>
            </ul>
        </section>
    )
}