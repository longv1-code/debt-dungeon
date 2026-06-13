import { useState, useEffect } from 'react'
import { getStats } from '../api/stats.api.js'

const useStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        try {
            setLoading(true)
            const data = await getStats()
            setStats(data)
        } catch {
            setError('Failed to load stats')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats()
    }, [])

    return { stats, loading, error }
}

export default useStats
