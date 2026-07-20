import { Link, useSearchParams } from 'react-router-dom'
import { BarChart2, Swords, LogOut, Compass, Sword } from 'lucide-react'
import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useUserProfile from '../../hooks/useUserProfile'
import { createCheckoutSession } from '../../api/stripe.api.js'
import { ROUTES } from '../../constants/routes.constants'
import styles from './Navbar.module.css'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const { profile, fetchProfile } = useUserProfile()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get('upgraded') !== 'true') {
            return
        }

        let cancelled = false
        let attempts = 0
        const maxAttempts = 10

        const syncProfile = async () => {
            attempts += 1
            const updatedProfile = await fetchProfile()

            if (cancelled || updatedProfile?.tier === 'KNIGHT' || attempts >= maxAttempts) {
                return
            }

            window.setTimeout(syncProfile, 1500)
        }

        syncProfile()
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('upgraded')
        setSearchParams(nextParams, { replace: true })

        return () => {
            cancelled = true
        }
    }, [fetchProfile, searchParams, setSearchParams])

    const handleUpgrade = async () => {
        try {
            const { url } = await createCheckoutSession()
            if (url) {
                window.location.href = url
            }
        } catch (err) {
            console.error('Checkout failed:', err)
        }
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <Link to={ROUTES.DASHBOARD} className={styles.logo}>
                    <span className={styles.logoMark}>⚔️</span>
                    <span>Debt Dungeon</span>
                </Link>

                <div className={styles.links}>
                    <Link to={ROUTES.DASHBOARD} className={styles.link}>
                        <Swords size={18} /> Dungeon
                    </Link>
                    <Link to={ROUTES.STATS} className={styles.link}>
                        <BarChart2 size={18} /> Stats
                    </Link>
                </div>

                <div className={styles.right}>
                    {profile?.tier === 'ADVENTURER' && (
                        <span className={styles.tierBadge}>
                            <Compass size={14} /> {user?.username || 'Adventurer'}
                        </span>
                    )}
                    {profile?.tier === 'KNIGHT' && (
                        <span className={`${styles.tierBadge} ${styles.tierKnight}`}>
                            <Sword size={14} /> {user?.username || 'Knight'}
                        </span>
                    )}

                    {profile?.tier === 'ADVENTURER' && (
                        <button className={styles.upgradeBtn} onClick={handleUpgrade}>
                            Upgrade to Knight
                        </button>
                    )}

                    {user && <span className={styles.username}>⚡ {user.username}</span>}
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar