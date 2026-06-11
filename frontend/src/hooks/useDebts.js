import { useState, useEffect } from 'react'
import { getDebts, createDebt, deleteDebt } from '../api/debts.api.js'
import { createPayment } from '../api/payments.api.js'

const useDebts = () => {
    const [debts, setDebts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchDebts = async() => {
        try {
            setLoading(true)
            const data = await getDebts()
            setDebts(data)
        } catch {
            setError('Failed to load debts')
        } finally {
            setLoading(false)
        }
    }

    // Fetch all debts when the hook first loads
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDebts()
    }, [])
    

    const addDebt = async (debtData) => {
        const newDebt = await createDebt(debtData)
        // Add new debt to existing list without refetching
        setDebts((prev) => [newDebt, ...prev])
        return newDebt
    }

    const removeDebt = async (id) => {
        await deleteDebt(id)
        // Remove debt from list by filtering it out
        setDebts((prev) => prev.filter((debt) => debt.id !== id))
    }

    const logPayment = async (debtId, paymentData) => {
        const result = await createPayment(debtId, paymentData)
        // Update the specific debt's balance in our list
        setDebts((prev) =>
            prev.map((debt) =>
                debt.id === debtId ? result.debt : debt
            )
        )
        return result
    }

    return { debts, loading, error, addDebt, removeDebt, logPayment, fetchDebts }
}

export default useDebts