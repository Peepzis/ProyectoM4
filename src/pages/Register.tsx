import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormField } from '../components/FormField'
import { registerWithEmail } from '../services/firebase/authService'
import { getAuthErrorMessage } from '../utils/authErrors'
import {
    validateConfirmPassword,
    validateEmail,
    validatePassword,
} from '../utils/validators'

interface FormErrors {
    email: string | null
    password: string | null
    confirmPassword: string | null
}

export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<FormErrors>({
        email: null,
        password: null,
        confirmPassword: null,
    })
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitError(null)

        const newErrors: FormErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        }
        setErrors(newErrors)

        if (newErrors.email || newErrors.password || newErrors.confirmPassword) {
            return
        }

        setSubmitting(true)
        try {
            await registerWithEmail(email.trim(), password)
        } catch (error) {
            setSubmitError(getAuthErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Crear cuenta</h2>

            <FormField
                id="register-email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                error={errors.email}
                onChange={setEmail}
            />
            <FormField
                id="register-password"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={password}
                error={errors.password}
                onChange={setPassword}
            />
            <FormField
                id="register-confirm-password"
                label="Confirmar contraseña"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                error={errors.confirmPassword}
                onChange={setConfirmPassword}
            />

            {submitError && (
                <p className="form-error" role="alert">
                    {submitError}
                </p>
            )}

            <button type="submit" disabled={submitting}>
                {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
        </form>
    )
}