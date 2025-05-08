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
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => document.body.style.overflow = '';
  }, [isOpen])

  const modal = (
    <div
      className={styles["modal-overlay"]}
      onClick={closeModal}
      role="dialog"
      aria-labelledby="video-modal-title"
      aria-hidden={!isOpen}
    >
      <button
        className={styles["modal--close-btn"]}
        onClick={closeModal}
        aria-label="Close video modal"
      >
        <IoClose />
      </button>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["video-wrapper"]}>
          <iframe
            className={styles["video-iframe"]}
            width="80%"
            height="80%"
            onError={() => console.log("Video failed to load")}
            src={url}
            title={title}
            frameBorder="0"
            allowFullScreen
            aria-describedby="video-description"
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={styles["open-video-btn"]}
        aria-label="Watch video now"
      >
        Watch Now
      </button>
      {isOpen && ReactDOM.createPortal(modal, document.body)}
    </>
  )
}
