import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import useStats from '../hooks/useStats'
import useUserProfile from '../hooks/useUserProfile'
import Navbar from '../components/layout/Navbar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import DebtBreakdownChart from '../components/charts/DebtBreakdownChart'
import PaymentHistoryChart from '../components/charts/PaymentHistoryChart'
import { formatCurrency } from '../utils/currency.utils'
import { ROUTES } from '../constants/routes.constants'
import styles from './Stats.page.module.css'

const StatsPage = () => {
    const { stats, loading, error } = useStats()
    const { profile } = useUserProfile()

    if (loading) return <LoadingSpinner />
    if (error) return <div>{error}</div>
    if (!stats) return <div>No data yet</div>

    const { 
        totalOriginalDebt, 
        totalPaid, 
        progressPercentage, 
        monthlyInterestTotal, 
        activeBosses, 
        defeatedBosses, 
        debtBreakdown, 
        paymentHistory 
    } = stats

    const isKnight = profile?.tier === 'KNIGHT'

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.main}>
                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Original Debt</span>
                        <span className={styles.statValue}>{formatCurrency(totalOriginalDebt)}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total Paid</span>
                        <span className={`${styles.statValue} ${styles.success}`}>
                        {formatCurrency(totalPaid)}
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Progress</span>
                        <span className={`${styles.statValue} ${styles.success}`}>
                        {progressPercentage}%
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Monthly Interest</span>
                        <span className={`${styles.statValue} ${styles.danger}`}>
                        {formatCurrency(monthlyInterestTotal)}
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Active Bosses</span>
                        <span className={`${styles.statValue} ${styles.danger}`}>
                        {activeBosses}
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Defeated</span>
                        <span className={`${styles.statValue} ${styles.success}`}>
                        {defeatedBosses}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <span>Overall Progress</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className={styles.progressLabels}>
                        <span>Paid: {formatCurrency(totalPaid)}</span>
                        <span>Remaining: {formatCurrency(totalOriginalDebt - totalPaid)}</span>
                    </div>
                </div>

                {/* Charts -- Knights Only */}
                {isKnight ? (
                    <div className={styles.chartsGrid}>
                        <div className={styles.chartCard}>
                            <h3>Debt Breakdown</h3>
                            <DebtBreakdownChart debtBreakdown={debtBreakdown} />
                        </div>
                        <div className={styles.chartCard}>
                            <h3>Payment History</h3>
                            <PaymentHistoryChart paymentHistory={paymentHistory} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.lockedSection}>
                        <div className={styles.lockedCard}>
                            <Lock size={32} className={styles.lockIcon} />
                            <h3 className={styles.lockedTitle}>Advanced Analytics</h3>
                            <p className={styles.lockedText}>
                                Debt breakdown charts and payment history graphs are available on the Knight tier.
                            </p>
                            <Link to={ROUTES.PRICING} className={styles.lockedBtn}>
                                Upgrade to Knight — $5
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default StatsPage