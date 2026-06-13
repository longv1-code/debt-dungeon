import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatCurrency } from '../../utils/currency.utils'
import { formatDate } from '../../utils/date.utils'
import styles from './PaymentHistoryChart.module.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
)

const PaymentHistoryChart = ({ paymentHistory }) => {
    if (!paymentHistory || paymentHistory.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No payments logged yet</p>
            </div>
        )
    }

    const data = {
        labels: paymentHistory.map((p) => formatDate(p.paidAt)),
        datasets: [
            {
                label: 'Payment Amount',
                data: paymentHistory.map((p) => p.amount),
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1',
                borderWidth: 2,
                pointBackgroundColor: '#7c3aed',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.3,   // slight curve on the line
                fill: true,     // fills area under the line
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
                    label: (context) => ` ${formatCurrency(context.parsed.y)}`,
                    title: (items) => items[0].label
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
                ticks: {
                    color: '#94a3b8',
                    maxRotation: 45,
                },
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
            <Line data={data} options={options} />
        </div>
    )
}

export default PaymentHistoryChart