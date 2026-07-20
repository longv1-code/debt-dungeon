import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/index.js'

const useUserProfile = () => {
    const { isSignedIn } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProfile = async () => {
        if (!isSignedIn) return null
        try {
            setLoading(true)
            const response = await api.get('/user/me')
            setProfile(response.data)
            return response.data
        } catch (err) {
            console.error('profile fetch error:', err)
            setError('Failed to load profile')
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [isSignedIn])

    return { profile, loading, error, fetchProfile }
}

export default useUserProfile