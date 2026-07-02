import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { ROUTES } from '../../constants/routes.constants'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth()
    console.log('ProtectedRoute check:', { isLoaded, isSignedIn })

    if (!isLoaded) {
        return <LoadingSpinner />
    }

    if (!isSignedIn) {
        return <Navigate to={ROUTES.AUTH} replace />
    }

    return children 
}

export default ProtectedRoute
