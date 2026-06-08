import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './AddDebtModal.module.css'

const DEBT_TYPES = [
    { value: 'CREDIT_CARD',     label: '🧛 Credit Card'     },
    { value: 'STUDENT_LOAN',    label: '👻 Student Loan'    },
    { value: 'AUTO_LOAN',       label: '🤖 Auto Loan'       },
    { value: 'MEDICAL',         label: '🦠 Medical'         },
    { value: 'PERSONAL',        label: '🗡️ Personal'        },
    { value: 'OTHER',           label: '❓ Other'           },
]

const AddDebtModal = ({isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('')
    const [type, setType] = useState('CREDIT_CARD')
    const [originalAmount, setOriginalAmount] = useState('')
    const [interestRate, setInterestRate] = useState('')
    const [minimumPayment, setMinimumPayment] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await onAdd({
                name,
                type,
                originalAmount: parseFloat(originalAmount),
                interestRate:   parseFloat(interestRate),
                minimumPayment: parseFloat(minimumPayment),
            })

            // reset Modal states
            onClose()
            setName('')
            setType('CREDIT_CARD')
            setOriginalAmount('')
            setInterestRate('')
            setMinimumPayment('')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='⚔️ Spawn New Boss'>
            <div className={styles.form}>
                <div className={styles.field}>
                    <label>Boss Name</label>
                    <input
                        type='text'
                        placeholder='The Credit Leech'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                
                <div className={styles.field}>
                    <label>Debt Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {DEBT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>Total Amount ($)</label>
                        <input
                            type='number'
                            placeholder='5000'
                            value={originalAmount}
                            onChange={(e) => setOriginalAmount(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Interest Rate (%)</label>
                        <input
                            type='number'
                            placeholder='19.99'
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className={styles.field}>
                    <label>Minimum Monthly Payment ($)</label>
                    <input
                        type='number'
                        placeholder='50'
                        value={minimumPayment}
                        onChange={(e) => setMinimumPayment(e.target.value)}
                    />
                </div>

                <div className={styles.footer}>
                    <Button variant='secondary' onClick={onClose}>Cancel</Button>
                    <Button variant='primary' loading={loading} onClick={handleSubmit}>
                        Spawn Boss
                    </Button>
                </div>

            </div>
        </Modal>
    )
}

export default AddDebtModal
