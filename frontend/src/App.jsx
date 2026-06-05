import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/Auth.page'
import DashboardPage from './pages/Dashboard.page'
import BossDetailPage from './pages/BossDetail.page'
import StatsPage from './pages/Stats.page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/boss/:id' element={<BossDetailPage />} />
        <Route path='/stats' element={<StatsPage />} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App