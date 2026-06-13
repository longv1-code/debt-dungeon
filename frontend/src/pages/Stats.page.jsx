import useStats from '../hooks/useStats'
import useAuth from '../hooks/useAuth'
import Navbar from '../components/layout/Navbar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import DebtBreakdownChart from '../components/charts/DebtBreakdownChart'
import PaymentHistoryChart from '../components/charts/PaymentHistoryChart'
import { formatCurrency } from '../utils/currency.utils'
import styles from './Stats.page.module.css'

const StatsPage = () => {
    useAuth()

    const { stats, loading, error } = useStats()

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

                {/* Charts */}
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

            </main>
        </div>
    )
}

export default StatsPage