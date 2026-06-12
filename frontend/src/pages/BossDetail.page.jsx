import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import usePayments from '../hooks/usePayments'
import { ROUTES } from '../constants/routes.constants'
import { toast } from 'react-hot-toast'
import { createPayment } from '../api/payments.api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import styles from './BossDetail.page.module.css'
import Navbar from '../components/layout/Navbar'
import { formatCurrency } from '../utils/currency.utils'
import { BOSS_TYPES } from '../data/bossTypes'
import HPBar from '../components/boss/HPBar'
import DealDamageModal from '../components/boss/DealDamageModal'
import { formatDate } from '../utils/date.utils'

const BossDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { debt, payments, loading, error, refresh } = usePayments(parseInt(id))

  const [showDamage, setShowDamage] = useState(false) 

  const handlePayment = async (debtId, paymentData) => {
    const result = await createPayment(debtId, paymentData)
    if (result.defeated) {
      toast.success('🏆 Boss defeated! Debt slain!')
    } else {
      toast.success(`⚔️ ${formatCurrency(result.damage)} damage dealt!`)
    }
    // Close the modal after payment
    refresh()
    setShowDamage(false)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div>{error}</div>
  if (!debt) return <div>Debt not found</div>

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {/* Back button + page title */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(ROUTES.DASHBOARD)}>
            ← Back
          </button>
          <h1>{debt.name}</h1>
        </div>

        <div className={styles.content}>
          {/* Left panel */}
          <div className={styles.bossPanel}>
            <div className={styles.sprite}>
              {BOSS_TYPES[debt.type].sprite}
            </div>

            <HPBar
              currentBalance={debt.currentBalance}
              originalAmount={debt.originalAmount}
            />

            <div className={styles.statBar}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Original Balance</span>
                <span className={styles.statValue}>{formatCurrency(debt.originalAmount)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Interest Rate</span>
                <span className={styles.statValue}>{debt.interestRate}%</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Min Payment</span>
                <span className={styles.statValue}>{formatCurrency(debt.minimumPayment)}</span>
              </div>
            </div>

            {/* Deal Damage button lives INSIDE bossPanel */}
            {debt.currentBalance > 0 && (
              <button
                className={styles.damageBtn}
                onClick={() => setShowDamage(true)}
              >
                ⚔️ Deal Damage
              </button>
            )}
          </div>

          {/* Right panel */}
          <div className={styles.historyPanel}>
            <h3>Payment History</h3>
            {payments.length === 0 ? (
              <div className={styles.empty}>
                <p>No payments yet</p>
                <small>Start paying your debt off!</small>
              </div>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className={styles.historyCard}>
                  <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
                  <span className={styles.date}>{formatDate(payment.paidAt)}</span>
                  <span className={styles.note}>{payment.note || 'No note'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <DealDamageModal
        isOpen={showDamage}
        onClose={() => setShowDamage(false)}
        debt={debt}
        onPayment={handlePayment}
      />

    </div>
  )

}

export default BossDetailPage
