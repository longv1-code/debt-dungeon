import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import BossCard from '../components/boss/BossCard'
import DonutChart from '../components/charts/DonutChart'
import AddDebtModal from '../components/boss/AddDebtModal'
import DealDamageModal from '../components/boss/DealDamageModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Button from '../components/ui/Button'
import useDebts from '../hooks/useDebts'
import useAuth from '../hooks/useAuth'
import { formatCurrency } from '../utils/currency.utils'
import styles from './Dashboard.page.module.css'

const DashboardPage = () => {
  // Protects this page -- redirects if not logged in
  useAuth()

  const { debts, loading, addDebt, removeDebt, logPayment } = useDebts()

  // Modal state
  // Controls whether AddDebtModal is visible
  const [showAddDebt, setShowAddDebt] = useState(false)

  // Stores whichever debt the user clicked "Deal Damage" on
  // null means no modal open, a debt object means modal is open
  const [selectedDebt, setSelectedDebt] = useState(null)

  // Derived stats -- calculated from debts array
  const totalBalance = debts.reduce((sum, debt) => sum + debt.currentBalance, 0)
  const totalOriginal = debts.reduce((sum, debt) => sum + debt.originalAmount, 0)
  const totalPaid = totalOriginal - totalBalance
  const activeBosses = debts.filter((debt) => debt.currentBalance > 0).length
  const defeatBosses = debts.filter((debt) => debt.currentBalance === 0).length

  // Called by AddDebtModal with the form data when user hits Spawn Boss
  const handleAddDebt = async (debtData) => {
    await addDebt(debtData)
    toast.success('⚔️ New boss spawned!')
  }

  // Called by DealDamageModal with debtId and { amount, note }
  const handlePayment = async (debtId, paymentData) => {
    const result = await logPayment(debtId, paymentData)
    if (result.defeated) {
      toast.success('🏆 Boss defeated! Debt slain!')
    } else {
      toast.success(`⚔️ ${formatCurrency(result.damage)} damage dealt!`)
    }
    // Close the modal after payment
    setSelectedDebt(null)
  }

  // Called by BossCard with the debt's id when user clicks delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this boss permanently?')) return
    await removeDebt(id)
    toast.success('Boss removed from dungeon')
  }

  if (loading) return <LoadingSpinner message='Loading your dungeon...' />

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Debt</span>
            <span className={styles.statValue}>{formatCurrency(totalBalance)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Paid</span>
            <span className={`${styles.statValue} ${styles.paid}`}>
              {formatCurrency(totalPaid)}
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
              {defeatBosses}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left -- Donut Chart */}
          <div className={styles.chartSection}>
            <div className={styles.sectionHeader}>
              <h2>Dungeon Map</h2>
            </div>
            <div className={styles.chartCard}>
              <DonutChart debts={debts} />
            </div>
          </div>

          {/* Right -- Boss Grid */}
          <div className={styles.bossSection}>
            <div className={styles.sectionHeader}>
              <h2>Active Bosses</h2>
              <Button
                variant='primary'
                size='sm'
                onClick={() => setShowAddDebt(true)}
              >
                + Spawn Boss
              </Button>
            </div>

            {debts.length === 0 ? (
              <div className={styles.empty}>
                <p>No bosses yet</p>
                <small>Add a debt to begin your quest.</small>
              </div>
            ) : (
              <div className={styles.bossGrid}>
                {debts.map((debt) => (
                  <BossCard
                    key={debt.id}
                    debt={debt}
                    // BossCard calls onPayment(debt) — we receive it here
                    // and store it so DealDamageModal knows which boss to attack
                    onPayment={(debt) => setSelectedDebt(debt)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Modals */}
      {/* AddDebtModal — controlled by showAddDebt state */}
      <AddDebtModal
        isOpen={showAddDebt}
        onClose={() => setShowAddDebt(false)}
        onAdd={handleAddDebt}
      />

      {/* DealDamageModal — open when selectedDebt is not null */}
      <DealDamageModal
        isOpen={selectedDebt !== null}
        onClose={() => setSelectedDebt(null)}
        debt={selectedDebt}
        onPayment={handlePayment}
      />
      
    </div>
  )
}

export default DashboardPage
