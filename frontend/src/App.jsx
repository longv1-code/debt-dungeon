import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import { setTokenGetter } from './api/index'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AuthPage from './pages/Auth.page'
import DashboardPage from './pages/Dashboard.page'
import BossDetailPage from './pages/BossDetail.page'
import StatsPage from './pages/Stats.page'
import LandingPage from './pages/Landing.page'
import PricingPage from './pages/Pricing.page'

function App() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(getToken)
  }, [getToken])

  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/dashboard' element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/boss/:id' element={
          <ProtectedRoute><BossDetailPage /></ProtectedRoute>
        } />
        <Route path='/stats' element={
          <ProtectedRoute><StatsPage /></ProtectedRoute>
        } />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App