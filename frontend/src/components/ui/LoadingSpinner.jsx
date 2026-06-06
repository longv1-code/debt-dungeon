import styles from './LoadingSpinner.module.css'

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
            <p>{message}</p>
        </div>
    )
}

export default LoadingSpinner