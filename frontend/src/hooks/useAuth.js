import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'
import { ROUTES } from '../constants/routes.constants.js'

const useAuth = () => {
    const { isLoaded, isSignedIn, signOut } = useClerkAuth()
    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate(ROUTES.AUTH)
        }
    }, [isLoaded, isSignedIn, navigate])

    const handleLogout = () => {
        signOut(() => navigate(ROUTES.AUTH))
    }

    return { user, isLoaded, isSignedIn, handleLogout }
}

export default useAuth