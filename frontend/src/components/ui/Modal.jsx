import { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, title, children }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown'), handleKey
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
