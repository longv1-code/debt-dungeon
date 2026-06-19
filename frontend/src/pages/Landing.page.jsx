import { Link } from 'react-router-dom'
import { Shield, Swords, BarChart2, Skull, Coins, TrendingDown } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar'
import { ROUTES } from '../constants/routes.constants'
import styles from './Landing.page.module.css'

const FEATURES = [
    {
        icon: Skull,
        title: 'Your Debt Is a Boss',
        description: 'Every debt becomes a monster with HP equal to your balance. Watch it take damage with every payment you make.',
    },
    {
        icon: Swords,
        title: 'Deal Real Damage',
        description: 'Log payments as attacks. The more you pay, the more damage you deal. Interest regenerates HP - so strike fast.',
    },
    {
        icon: BarChart2,
        title: 'Track Your Victory',
        description: 'See your progress across all debts. Charts, payment history, and stats show exactly how close you are to freedom.',
    },
]

const STEPS = [
    {
        number: '01',
        title: 'Add Your Debt',
        description: 'Enter your debt as a boss monster. Name it, set the balance, interest rate, and minimum payment.',
    },
    {
        number: '02',
        title: 'Fight Every Month',
        description: 'Every time you make a payment, log it as an attack. Watch the boss HP bar drop in real time.',
    },
    {
        number: '03',
        title: 'Slay Your Debt',
        description: 'Pay a debt to zero and the boss dies. Defeated bosses stay in your dungeon as trophies.',
    },
]

const LandingPage = () => {
    return (
        <div className={styles.page}>
            <LandingNavbar />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <h1 className={styles.heroTitle}>
                        Your Debt is a<br />
                        <span className={styles.heroAccent}>Dungeon Boss.</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Debt Dungeon turns your real financial debt into RPG boss monsters.
                        Every payment deals damage. Every paid-off debt is a kill.
                        Make paying off debt feel like winning.
                    </p>
                    <div className={styles.heroCtas}>
                        <Link to={ROUTES.AUTH} className={styles.primaryCta}>
                            Enter the Dungeon
                        </Link>
                        <a href='#how-it-works' className={styles.secondaryCta}>
                            See How It Works
                        </a>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <Coins size={20} className={styles.heroStatIcon} />
                            <span className={styles.heroStatValue}>$0</span>
                            <span className={styles.heroStatLabel}>to get started</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStat}>
                            <TrendingDown size={20} className={styles.heroStatIcon} />
                            <span className={styles.heroStatValue}>100%</span>
                            <span className={styles.heroStatLabel}>real debt tracking</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStat}>
                            <Shield size={20} className={styles.heroStatIcon} />
                            <span className={styles.heroStatValue}>∞</span>
                            <span className={styles.heroStatLabel}>bosses to slay</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className={styles.features}>
                <div className={styles.sectionInner}>
                    <h2 className={styles.sectionTitle}>Why Debt Dungeon?</h2>
                    <p className={styles.sectionSub}>
                        Traditional budgeting apps are boring. This one makes you want to pay off debt.
                    </p>
                    <div className={styles.featureGrid}>
                        {FEATURES.map((feature, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDesc}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* How It Works */}
            <section className={styles.howItWorks} id='how-it-works'>
                <div className={styles.sectionInner}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionSub}>
                        Three steps to turn your financial anxiety into a game you can win.
                    </p>
                    <div className={styles.steps}>
                        {STEPS.map((step, i) => (
                        <div key={i} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.description}</p>
                            </div>
                            {i < STEPS.length - 1 && (
                            <div className={styles.stepArrow}>→</div>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.sectionInner}>
                    <h2 className={styles.finalTitle}>Ready to fight back?</h2>
                    <p className={styles.finalSub}>
                        Your debt has been attacking you for years. It's time to attack back.
                    </p>
                    <Link to={ROUTES.AUTH} className={styles.primaryCta}>
                        Start Slaying — It's Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerLeft}>
                        <span className={styles.footerLogo}>Debt Dungeon</span>
                        <span className={styles.footerTagline}>
                        Face your debts. Slay your bosses.
                        </span>
                    </div>
                    <div className={styles.footerCredits}>
                        <span className={styles.creditsTitle}>Asset Credits</span>
                        <span>Demon Slime — ElectricMeat via itch.io</span>
                        <span>Monster Sprites — Free RPG Monster Pack via itch.io</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
