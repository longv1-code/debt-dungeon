import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './DealDamageModal.module.css'
import { formatCurrency } from '../../utils/currency.utils.js'

const DealDamageModal = ({ isOpen, onClose, debt, onPayment }) => {
    const [amount, setAmount] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)

    if (!debt) return null
    const currentHp = formatCurrency(debt.currentBalance)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await onPayment(
                debt.id,
                {
                    amount: parseFloat(amount),
                    note,
                }
            )
            // Reset states
            onClose()
            setAmount('')
            setNote('')
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`⚔️ Attack: ${debt.name}`}>
            <div className={styles.form}>
                <div className={styles.bossHP}>
                    <span className={styles.hpLabel}>Current HP</span>
                    <span className={styles.hpValue}>{currentHp}</span>
                </div>
                
                <div className={styles.field}>
                    <label>Amount to Deal Damage ($)</label>
                    <input
                        type='number'
                        placeholder='200'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className={styles.field}>
                    <label>Note for Damage</label>
                    <input
                        type='text'
                        placeholder='Monthly payment'
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className={styles.footer}>
                    <Button variant='secondary' onClick={onClose}>Retreat</Button>
                    <Button 
                        variant='primary'
                        loading={loading} 
                        disabled={!amount || amount <= 0} 
                        onClick={handleSubmit}
                    >
                        ⚔️ Deal Damage
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default DealDamageModal
