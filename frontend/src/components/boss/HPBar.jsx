import styles from './HPBar.module.css'
import { getHPColor } from '../../utils/damage.utils'
import { calcPercentage, formatCurrency } from '../../utils/currency.utils'

const HPBar = ({ currentBalance, originalAmount }) => {
    // Calculate percentage
    const percentage = Math.max(0, calcPercentage(currentBalance, originalAmount))

    // Get color based on HP percentage
    const color = getHPColor(currentBalance, originalAmount)

    return (
        <div className={styles.container}>
            <div className={styles.track}>
                <div
                    className={styles.fill}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}`
                    }}
                />
            </div>
            <div className={styles.labels}>
                <span style={{ color: color }}>{percentage}% HP</span>
                <span className={styles.balance}>
                    {formatCurrency(currentBalance)} / {formatCurrency(originalAmount)}
                </span>
            </div>
        </div>
    )
}

export default HPBar
