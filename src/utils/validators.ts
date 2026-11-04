export function validateEmail(email: string): string | null {
    const value = email.trim()

    if (value === '') {
        return 'El email es obligatorio.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Ingresá un email válido.'
    }

    return null
}

export function validatePassword(password: string): string | null {
    if (password === '') {
        return 'La contraseña es obligatoria.'
    }

    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.'
    }

    return null
}

export function validateConfirmPassword(
    password: string,
    confirmPassword: string,
): string | null {
    if (confirmPassword === '') {
        return 'Confirmá tu contraseña.'
    }

    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden.'
    }

    return null
}