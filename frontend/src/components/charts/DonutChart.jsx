import { Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { DEBT_CATEGORIES } from '../../data/debtCategories'
import { formatCurrency } from '../../utils/currency.utils'
import styles from './DonutChart.module.css'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const DonutChart = ({ debts }) => {
    const activeDebts = debts.filter((d) => d.currentBalance > 0)

    // Empty state -- no active debts
    if (activeDebts.length === 0) {
        return (
            <div className={styles.empty}>
                <p>🏆 No active bosses!</p>
                <small>All debts defeated</small>
            </div>
        )
    }

    // Chart data from active debts
    const data = {
        labels: activeDebts.map((d) => d.name),
        datasets: [{
            data: activeDebts.map((d) => d.currentBalance),
            backgroundColor: activeDebts.map((d) => DEBT_CATEGORIES[d.type].color),
            borderColor: 'transparent',
            hoverOffset: 8,
        }]
    }

    const options = {
        cutout: '65%',          // Cuts out 65% of the center
        plugins: {
            legend: {
                display: false  // Building our own legend
            },
            tooltip: {
                callbacks: {    // Overrides default tooltip text
                    // Format tooltip value as currency
                    label: (context) => {
                        const value = context.parsed
                        return ` ${formatCurrency(value)}`
                    }
                },
                backgroundColor: '#16213e',
                borderColor: '#2a2a4a',
                borderWidth: 1,
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                padding: 12,
            }
        }
    }

    return (
        <div className={styles.container}>
            {/* Chart */}
            <div className={styles.chartWrapper}>
                <Doughnut data={data} options={options} />
            </div>

            {/* Custom Legend */}
            <div className={styles.legend}>
                {activeDebts.map((debt) => {
                    <div key={debt.id} className={styles.legendItem}>
                        <span
                            className={styles.dot}
                            style={{ background: DEBT_CATEGORIES[debt.type].color}}
                        />
                        <span className={styles.legendName}>{debt.name}</span>
                        <span className={styles.legendValue}>
                            {formatCurrency(debt.currentBalance)}
                        </span>
                    </div>
                })}
            </div>
        </div>
    )
}

export default DonutChart