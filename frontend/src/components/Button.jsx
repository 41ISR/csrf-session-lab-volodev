import React from 'react'

const Button = ({ children, onClick, className, ...rest }) => {
    const combinedClassName = `btn ${className || ''}`

    return (
        <button onClick={onClick} className={combinedClassName} {...rest}>
            {children}
        </button>
    )
}

export default Button