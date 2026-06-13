import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { DEBT_CATEGORIES } from '../../data/debtCategories.js'
import { formatCurrency } from '../../utils/currency.utils.js'
import styles from './DebtBreakdownChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const DebtBreakdownChart = ({ debtBreakdown }) => {
    if (!debtBreakdown || debtBreakdown.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No debt data yet</p>
            </div>
        )
    }

    const data = {
        labels: debtBreakdown.map((d) => d.name),
        datasets: [
            {
                label: 'Remaining Balance',
                data: debtBreakdown.map((d) => d.currentBalance),
                backgroundColor: debtBreakdown.map((d) => 
                    DEBT_CATEGORIES[d.type].color + '99' // 99 = 60% opacity in hex
                ),
                borderColor: debtBreakdown.map((d) => 
                    DEBT_CATEGORIES[d.type].color
                ),
                borderWidth: 2,
                borderRadius: 6,
            },
            {
                label: 'Amount Paid',
                data: debtBreakdown.map((d) => d.originalAmount - d.currentBalance),
                backgroundColor: 'rgba(16, 185, 129, 0.4)',
                borderColor: '#10b981',
                borderWidth: 2,
                borderRadius: 6,
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return ` ${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                    }
                },
                backgroundColor: '#16213e',
                borderColor: '#2a2a4a',
                borderWidth: 1,
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                padding: 12,
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255,255,255,0.05' }
            },
            y: {
                ticks: {
                    color: '#94a3b8',
                    callback: (value) => formatCurrency(value)
                },
                grid: { color: 'rgba(255,255,255,0.05' }
            }
        }
    }

    return (
        <div className={styles.container}>
            <Bar data={data} options={options} />
        </div>
    )
}

export default DebtBreakdownChart
