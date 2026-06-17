import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.constants'
import styles from './LandingNavbar.module.css'

const LandingNavbar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <Link to={ROUTES.HOME} className={styles.logo}>
                    Debt Dungeon
                </Link>
                <div className={styles.actions}>
                    <Link to={ROUTES.AUTH} className={styles.loginBtn}>
                        Login
                    </Link>
                    <Link to={ROUTES.AUTH} className={styles.registerBtn}>
                        Enter the Dungeon
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default LandingNavbar
