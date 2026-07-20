import { Compass, Sword, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import useUserProfile from '../hooks/useUserProfile'
import { createCheckoutSession } from '../api/stripe.api.js'
import LandingNavbar from '../components/layout/LandingNavbar'
import Navbar from '../components/layout/Navbar'
import { ROUTES } from '../constants/routes.constants'
import styles from './Pricing.page.module.css'

const ADVENTURER_FEATURES = [
    { text: 'Up to 3 active bosses', included: true },
    { text: 'Basic stats (balance, progress)', included: true },
    { text: 'Payment history', included: true },
    { text: 'Boss sprite animations', included: true },
    { text: 'Unlimited active bosses', included: false },
    { text: 'Advanced stats & forecasting', included: false },
    { text: 'Interest cost analysis', included: false },
]

const KNIGHT_FEATURES = [
    { text: 'Unlimited active bosses', included: true },
    { text: 'Basic stats (balance, progress)', included: true },
    { text: 'Payment history', included: true },
    { text: 'Boss sprite animations', included: true },
    { text: 'Advanced stats & forecasting', included: true },
    { text: 'Interest cost analysis', included: true },
    { text: 'Lifetime access — one-time purchase', included: true },
]

const PricingPage = () => {
    const { isSignedIn } = useAuth()
    const { profile } = useUserProfile()
    const navigate = useNavigate()

    const handleUpgrade = async () => {
        if (!isSignedIn) {
            navigate(ROUTES.AUTH)
            return
        }
        try {
            const { url } = await createCheckoutSession()
            if (url) window.location.href = url
        } catch (err) {
            console.error('Checkout failed:', err)
        }
    }

    const isKnight = profile?.tier === 'KNIGHT'

    return (
        <div className={styles.page}>
            {isSignedIn ? <Navbar /> : <LandingNavbar />}

            <main className={styles.main}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Choose Your Path</h1>
                    <p className={styles.subtitle}>
                        Start free. Upgrade once. Slay debt forever.
                    </p>
                </div>

                <div className={styles.cards}>
                    {/* Adventurer */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrap}>
                                <Compass size={28} />
                            </div>
                            <h2 className={styles.tierName}>Adventurer</h2>
                            <div className={styles.price}>
                                <span className={styles.amount}>$0</span>
                                <span className={styles.period}>free forever</span>
                            </div>
                        </div>

                        <ul className={styles.features}>
                        {ADVENTURER_FEATURES.map((f, i) => (
                            <li key={i} className={`${styles.feature} ${!f.included ? styles.featureLocked : ''}`}>
                            {f.included
                                ? <Check size={16} className={styles.checkIcon} />
                                : <X size={16} className={styles.xIcon} />
                            }
                            {f.text}
                            </li>
                        ))}
                        </ul>

                        <button className={styles.currentBtn} disabled>
                            {isSignedIn ? 'Current Plan' : 'Get Started Free'}
                        </button>
                    </div>

                    {/* Knight */}
                    <div className={`${styles.card} ${styles.cardFeatured}`}>
                        <div className={styles.featuredBadge}>Best Value</div>
                        <div className={styles.cardHeader}>
                            <div className={`${styles.iconWrap} ${styles.iconKnight}`}>
                                <Sword size={28} />
                            </div>
                            <h2 className={styles.tierName}>Knight</h2>
                            <div className={styles.price}>
                                <span className={styles.amount}>$5</span>
                                <span className={styles.period}>one-time</span>
                            </div>
                        </div>

                        <ul className={styles.features}>
                        {KNIGHT_FEATURES.map((f, i) => (
                            <li key={i} className={styles.feature}>
                            <Check size={16} className={styles.checkIcon} />
                            {f.text}
                            </li>
                        ))}
                        </ul>

                        {isKnight ? (
                            <button className={styles.currentBtn} disabled>
                                Current Plan
                            </button>
                            ) : (
                            <button className={styles.upgradeBtn} onClick={handleUpgrade}>
                                <Sword size={16} />
                                {isSignedIn ? 'Upgrade to Knight — $5' : 'Get Knight — $5'}
                            </button>
                        )}
                    </div>
                </div>

                <p className={styles.footnote}>
                    Payments processed securely by Stripe. No subscription, no hidden fees.
                </p>
            </main>
        </div>
    )
}

export default PricingPage
