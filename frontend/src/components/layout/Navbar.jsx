import { Link } from 'react-router-dom'
import { BarChart2, Swords, LogOut } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes.constants'
import styles from './Navbar.module.css'

const Navbar = () => {
    const {user, handleLogout} = useAuth()
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                {/* Logo - links to dashboard */}
                <Link to={ROUTES.DASHBOARD} className={styles.logo}>
                    ⚔️ <span>Debt Dungeon</span>
                </Link>

                {/* Nav links */}
                <div className={styles.links}>
                    <Link to={ROUTES.DASHBOARD} className={styles.link}>
                        <Swords size={18} /> Dungeon
                    </Link>
                    <Link to={ROUTES.STATS} className={styles.link}>
                        <BarChart2 size={18} /> Stats
                    </Link>
                </div>

                {/* Right Side */}
                <div className={styles.right}>
                    {/* Only show username if user exists */}
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
