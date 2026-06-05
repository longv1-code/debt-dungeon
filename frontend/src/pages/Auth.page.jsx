import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth.api.js'
import useAuthStore from '../store/auth.store.js'
import { ROUTES } from '../constants/routes.constants.js'
import styles from './Auth.page.module.css'

const AuthPage = () => {
  // Two modes: 'login' or 'register'
  const [mode, setMode] = useState('login')

  // Form field state
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get the login action from Zustand store
  const login = useAuthStore((state) => state.login)

  // useNavigate let us redirect programmatically
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      let data

      if (mode === 'login') {
        data = await loginUser({ email, password })
      } else {
        data = await registerUser({ email, username, password })
      }

      // Save to Zustand store
      login(data.user, data.token)

      // Redirect to dashboard
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.logo}>
          <h1>⚔️ Debt Dungeon</h1>
          <p>Face your debts. Slay your bosses.</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type='email'
              placeholder='hero@dungeon.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className={styles.field}>
              <label>Username</label>
              <input
                type='text'
                placeholder='DungeonSlayer99'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className={styles.field}>
            <label>Password</label>
            <input
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? '⚔️ Enter the Dungeon' : '🛡️ Create Account'}
          </button>
        </div>

      </div>
    </div>
  )
}


export default AuthPage
