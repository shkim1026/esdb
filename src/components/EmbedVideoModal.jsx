import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { IoClose } from 'react-icons/io5'

export default function EmbedVideoModal({ url, title }) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
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
        <div className="modal-overlay" onClick={closeModal}>
        <button className="modal--close-btn" onClick={closeModal}><IoClose /></button>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-wrapper">
                <iframe 
                    width="80%"
                    height="80%"
                    src={url}
                    title={title}
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    </div>
    )
    return (
        <>
            <button onClick={openModal} className="open-video-btn">
                Watch Now
            </button>
            {isOpen && ReactDOM.createPortal(modal, document.body)}
        </>
    )
}