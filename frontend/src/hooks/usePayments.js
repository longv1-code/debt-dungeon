import { useState, useEffect } from 'react'
import { getDebtById } from '../api/debts.api.js'
import { getPayments } from '../api/payments.api.js'

const usePayments = (debtId) => {
    const [debt, setDebt] = useState(null)
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const debtData = await getDebtById(debtId)
            const paymentData = await getPayments(debtId)
            setDebt(debtData)
            setPayments(paymentData)
        } catch {
            setError('Failed to load debt and payments')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (debtId) fetchData()
    }, [debtId])

    return { debt, payments, loading, error, refresh: fetchData }
}

export default usePayments