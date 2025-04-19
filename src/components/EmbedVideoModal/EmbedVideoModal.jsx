import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { IoClose } from 'react-icons/io5'
import styles from './EmbedVideoModal.module.css'

export default function EmbedVideoModal({ url, title }) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = (e) => {
        console.log('Opening video modal')
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(true)}
    const closeModal = () => setIsOpen(false)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => document.body.style.overflow ='';
    })
    
    const modal = (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
        <button className={styles["modal--close-btn"]} onClick={closeModal}><IoClose /></button>
        <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["video-wrapper"]}>
                <iframe 
                    className={styles["video-iframe"]}
                    width="80%"
                    height="80%"
                    onError={() => console.log("Video failed to load")}
                    src={url}
                    title={title}
                    frameborder="0"
                    allowFullScreen
                />
            </div>
        </div>
    </div>
    )
    return (
        <>
            <button type="button" onClick={(e) => {e.stopPropagation(); e.preventDefault(); setIsOpen(true)}} className={styles["open-video-btn"]}>
                Watch Now
            </button>
            {isOpen && ReactDOM.createPortal(modal, document.body)}
        </>
    )
}