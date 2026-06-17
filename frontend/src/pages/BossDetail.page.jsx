import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { createPayment } from '../api/payments.api'
import usePayments from '../hooks/usePayments'
import useAuth from '../hooks/useAuth'
import BossSprite from '../components/boss/BossSprite'
import HPBar from '../components/boss/HPBar'
import DealDamageModal from '../components/boss/DealDamageModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Navbar from '../components/layout/Navbar'
import { BOSS_TYPES } from '../data/bossTypes'
import { DEBT_CATEGORIES } from '../data/debtCategories'
import { formatCurrency } from '../utils/currency.utils'
import { formatDate } from '../utils/date.utils'
import { preloadBossSpriteAssets } from '../utils/spritePreload.utils'
import { ROUTES } from '../constants/routes.constants'
import styles from './BossDetail.page.module.css'

// How often the boss randomly attacks in milliseconds
const ATTACK_INTERVAL = 8000

function BossDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { debt, payments, loading, error, refresh } = usePayments(parseInt(id))

  // Animation state — controls which sprite animation plays
  const [animation, setAnimation] = useState('attack')
  const [showDamage, setShowDamage] = useState(false)
  const [isDefeated, setIsDefeated] = useState(false)

  // Ref for the random attack interval
  const attackIntervalRef = useRef(null)

  // Helper — plays a one-shot animation then returns to idle
  const playAnimation = (anim) => {
    setAnimation(anim)
  }

  const handleAnimationEnd = () => {
    if (!isDefeated) {
      setAnimation('idle')
    }
  }

  // On page load → boss attacks first, then random attacks every 8 seconds
  useEffect(() => {
    if (!debt || isDefeated) return

    // Initial attack on page load, deferred so the effect only schedules work
    const initialAttackTimeout = setTimeout(() => {
      setAnimation('attack')
    }, 0)

    // Random attacks at fixed interval
    attackIntervalRef.current = setInterval(() => {
      setAnimation('attack')
    }, ATTACK_INTERVAL)

    // Cleanup when leaving page
    return () => {
      clearTimeout(initialAttackTimeout)
      if (attackIntervalRef.current) {
        clearInterval(attackIntervalRef.current)
      }
    }
  }, [debt, isDefeated])

  // Preloads sprite images as soon as the debt type is known
  useEffect(() => {
    if (!debt) return
    preloadBossSpriteAssets(debt.type)
  }, [debt])

  const handlePayment = async (debtId, paymentData) => {
    const result = await createPayment(debtId, paymentData)

    if (result.defeated) {
      // Stop random attacks
      clearInterval(attackIntervalRef.current)
      setIsDefeated(true)
      playAnimation('death')
      toast.success('BOSS DEFEATED! Debt slain!')
    } else {
      // Boss takes a hit
      playAnimation('hit')
      toast.success(`${formatCurrency(result.damage)} damage dealt!`)
    }

    refresh()
    setShowDamage(false)
  }

  if (loading) return <LoadingSpinner message='Entering dungeon...' />
  if (error)   return <div className={styles.error}>{error}</div>
  if (!debt)   return <div className={styles.error}>Boss not found</div>

  const boss = BOSS_TYPES[debt.type]
  const category = DEBT_CATEGORIES[debt.type]
  const defeated = debt.currentBalance === 0

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.arena}>

        {/* Boss Header */}
        <div className={styles.bossHeader}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            ← Back
          </button>
          <div className={styles.bossTitleGroup}>
            <h1 className={styles.bossName}>{boss.name}</h1>
            <span
              className={styles.debtType}
              style={{ color: category.color }}
            >
              {category.label}
            </span>
          </div>
          <span className={styles.threatBadge}>
            {boss.threat} threat
          </span>
        </div>

        {/* HP Bar — full width, dramatic */}
        <div className={styles.hpSection}>
          <HPBar
            currentBalance={debt.currentBalance}
            originalAmount={debt.originalAmount}
          />
        </div>

        {/* Boss Sprite — center stage */}
        <div className={styles.spriteSection}>
          {defeated && (
            <div className={styles.defeatedOverlay}>
              DEFEATED
            </div>
          )}
          <BossSprite
            key={`${debt.type}-${defeated ? 'death' : animation}`}
            debtType={debt.type}
            animation={defeated ? 'death' : animation}
            onAnimationEnd={handleAnimationEnd}
          />
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Remaining</span>
            <span className={styles.statValue}>
              {formatCurrency(debt.currentBalance)}
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Interest</span>
            <span className={styles.statValue}>{debt.interestRate}%</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Min Payment</span>
            <span className={styles.statValue}>
              {formatCurrency(debt.minimumPayment)}
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>Original</span>
            <span className={styles.statValue}>
              {formatCurrency(debt.originalAmount)}
            </span>
          </div>
        </div>

        {/* Deal Damage Button */}
        {!defeated && (
          <div className={styles.actionSection}>
            <button
              className={styles.damageBtn}
              onClick={() => setShowDamage(true)}
            >
              DEAL DAMAGE
            </button>
          </div>
        )}

        {/* Payment History */}
        <div className={styles.historySection}>
          <h3>Combat Log</h3>
          {payments.length === 0 ? (
            <div className={styles.empty}>
              <p>No attacks yet</p>
              <small>Deal damage to begin your assault</small>
            </div>
          ) : (
            <div className={styles.historyList}>
              {payments.map((payment) => (
                <div key={payment.id} className={styles.historyRow}>
                  <span className={styles.historyAmount}>
                    -{formatCurrency(payment.amount)}
                  </span>
                  <span className={styles.historyDate}>
                    {formatDate(payment.paidAt)}
                  </span>
                  <span className={styles.historyNote}>
                    {payment.note || 'No note'}
                  </span>
                </div>
              ))}
            </div>
          )}
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