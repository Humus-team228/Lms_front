type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, type = 'button', variant = 'primary' }: ButtonProps) {
    const baseStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    }

    const variants = {
        primary: { backgroundColor: '#007bff', color: 'white' },
        secondary: { backgroundColor: '#6c757d', color: 'white' },
    }

    return (
        <button
            type={type}
            onClick={onClick}
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
        </button>
    )
}