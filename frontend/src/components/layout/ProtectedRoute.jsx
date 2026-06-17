import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/auth.store'
import { ROUTES } from '../../constants/routes.constants'

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH} replace />
    }

    return children 
}

export default ProtectedRoute
