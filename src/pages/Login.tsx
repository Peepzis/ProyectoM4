import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '../components/FormField'
import { loginWithEmail } from '../services/firebase/authService'
import { getAuthErrorMessage } from '../utils/authErrors'
import { validateEmail, validatePassword } from '../utils/validators'
import './auth.css'

interface FormErrors {
    email: string | null
    password: string | null
}

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<FormErrors>({
        email: null,
        password: null,
    })
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitError(null)

        const newErrors: FormErrors = {
            email: validateEmail(email),
            password: validatePassword(password),
        }
        setErrors(newErrors)

        if (newErrors.email || newErrors.password) {
            return
        }

        setSubmitting(true)
        try {
            await loginWithEmail(email.trim(), password)
        } catch (error) {
            setSubmitError(getAuthErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Iniciar sesión</h2>

            <FormField
                id="login-email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                error={errors.email}
                onChange={setEmail}
            />
            <FormField
                id="login-password"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={password}
                error={errors.password}
                onChange={setPassword}
            />

            {submitError && (
                <p className="form-error" role="alert">
                    {submitError}
                </p>
            )}

            <button type="submit" disabled={submitting}>
                {submitting ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <Link className="auth-link" to="/register">
                Crear cuenta
            </Link>
        </form>
    )
}