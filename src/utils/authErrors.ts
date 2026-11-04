const authErrorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/invalid-email': 'El email no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/user-not-found': 'Email o contraseña incorrectos.',
    'auth/wrong-password': 'Email o contraseña incorrectos.',
    'auth/too-many-requests':
        'Demasiados intentos. Probá de nuevo en unos minutos.',
    'auth/network-request-failed':
        'No hay conexión. Revisá tu internet e intentá de nuevo.',
}

const defaultMessage = 'Ocurrió un error inesperado. Intentá de nuevo.'

export function getAuthErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = String(error.code)
        return authErrorMessages[code] ?? defaultMessage
    }

    return defaultMessage
}