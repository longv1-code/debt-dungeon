import { Trash2, Sword } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HPBar from './HPBar.jsx'
import { BOSS_TYPES } from '../../data/bossTypes.js'
import { DEBT_CATEGORIES } from '../../data/debtCategories.js'
import { ROUTES } from '../../constants/routes.constants.js'
import { formatCurrency } from '../../utils/currency.utils.js'
import { getBossStatus } from '../../utils/damage.utils.js'
import styles from './BossCard.module.css'

const BossCard = ({ debt, onPayment, onDelete }) => {
    const navigate = useNavigate()

    // Boss data
    const boss = BOSS_TYPES[debt.type]
    const category = DEBT_CATEGORIES[debt.type]

    // Status label and defeated state
    const status = getBossStatus(debt.currentBalance, debt.originalAmount)
    const isDefeated = debt.currentBalance === 0

    return (
        <div
            className={`${styles.card} ${isDefeated ? styles.statusDefeated : ''}`}
            style={{ '--boss-color': category.color}}
        >
            {/* Header -- boss sprite, name, type, status badge */}
            <div className={styles.header}>
                <div className={styles.bossInfo}>
                    <span className={styles.sprite}>{boss.sprite}</span>
                    <div>
                        <h4 className={styles.name}>{debt.name}</h4>
                        <span className={styles.type} style={{ color: category.color}}>
                            {category.label}
                        </span>
                    </div>
                </div>
                <span className={`${styles.status} ${isDefeated ? styles.statusDefeated : ''}`}>
                    {status}
                </span>
            </div>

            {/* HP Bar */}
            <HPBar
                currentBalance={debt.currentBalance}
                originalAmount={debt.originalAmount}
            />

            {/* Stats row */}
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Remaining</span>
                    <span className={styles.statValue}>{formatCurrency(debt.currentBalance)}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Interest</span>
                    <span className={styles.statValue}>{debt.interestRate}%</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Min Payment</span>
                    <span className={styles.statValue}>{formatCurrency(debt.minimumPayment)}</span>
                </div>
            </div>

            {/* Defeated Banner / Actions */}
            {isDefeated ? (
                <div className={styles.defeatedBanner}>
                    🏆 BOSS DEFEATED
                </div>
            ) : (
                <div className={styles.actions}>
                    <button className={styles.damageBtn} onClick={() => onPayment(debt)}>
                        <Sword size={14} /> Deal Damage
                    </button>
                    <button classname={styles.viewBtn} onClick={() => navigate(ROUTES.BOSS(debt.id))}>
                        View
                    </button>
                    <button className={styles.deletedBtn} onClick={() => onDelete(debt.id)}>
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default BossCard
