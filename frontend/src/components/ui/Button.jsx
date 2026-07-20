import styles from './Button.module.css'

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    fullWidth = false,
}) => {
    return (
        <button
            type={type}
            className={[
                styles.btn,
                styles[variant],
                styles[size],
                fullWidth ? styles.fullWidth : '',
            ].join(' ')}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? <span className={styles.spinner} /> : children}
        </button>
    )
}

export default Button
