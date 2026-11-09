import { logout } from '../../services/firebase/authService'
import { useAuth } from './useAuth'

interface SessionHeaderProps {
    title: string
}

export function SessionHeader({ title }: SessionHeaderProps) {
    const { user } = useAuth()

    return (
        <div className="tasks-header">
            <h2>{title}</h2>
            <p>
                {user ? `Sesión iniciada: ${user.email}` : 'No hay sesión iniciada'}
            </p>
            {user && (
                <button className="logout-button" onClick={logout}>
                    Cerrar sesión
                </button>
            )}
        </div>
    )
}
