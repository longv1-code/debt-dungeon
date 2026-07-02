import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignIn, useSignUp } from '@clerk/clerk-react'
import { ROUTES } from '../constants/routes.constants.js'
import styles from './Auth.page.module.css'

const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'verify'

  // Form field state
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  // Shared UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSignInLoaded || !signIn || !setActive) {
        throw new Error('Authentication is still loading. Please try again in a moment.')
      }

      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      console.log('Full result:', JSON.stringify(result, null, 2))

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate(ROUTES.DASHBOARD)
        return
      }

      console.error('Unexpected sign-in result:', result)
      setError(`Sign-in stopped at "${result.status}". Check your Clerk sign-in settings.`)
    } catch (err) {
      console.error('Login failed:', err)
      setError(err.errors?.[0]?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSignUpLoaded || !signUp || !setActiveSignUp) {
        throw new Error('Authentication is still loading. Please try again in a moment.')
      }

      await signUp.create({
        emailAddress: email,
        username,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setMode('verify')
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!isSignUpLoaded || !signUp || !setActiveSignUp) {
        throw new Error('Authentication is still loading. Please try again in a moment.')
      }

      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        await setActiveSignUp({ session: result.createdSessionId })
        navigate(ROUTES.DASHBOARD)
        return
      } else {
        console.error('Unexpected verification result:', result)
        setError('Additional verification is required to complete sign-up.')
      }
    } catch (err) {
      console.error('Verification failed:', err)
      setError(err.errors?.[0]?.message || 'Invalid code')
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

        {mode !== 'verify' && (
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
        )}

        <div className={styles.form}>
          {mode === 'login' && (
            <>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='hero@dungeon.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
              <button className={styles.submitBtn} onClick={handleLogin} disabled={loading || !isSignInLoaded}>
                {loading ? 'Loading...' : '⚔️ Enter the Dungeon'}
              </button>
            </>
          )}

          {mode === 'register' && (
            <>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type='email'
                  placeholder='hero@dungeon.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label>Username</label>
                <input
                  type='text'
                  placeholder='DungeonSlayer99'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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
              <button className={styles.submitBtn} onClick={handleRegister} disabled={loading || !isSignUpLoaded}>
                {loading ? 'Loading...' : '🛡️ Create Account'}
              </button>
            </>
          )}

          {mode === 'verify' && (
            <>
              <p className={styles.verifyHint}>
                We sent a verification code to <strong>{email}</strong>. Enter it below to finish creating your account.
              </p>
              <div className={styles.field}>
                <label>Verification Code</label>
                <input
                  type='text'
                  placeholder='123456'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.submitBtn} onClick={handleVerify} disabled={loading || !isSignUpLoaded}>
                {loading ? 'Verifying...' : 'Confirm Code'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage