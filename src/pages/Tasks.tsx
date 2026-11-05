import { useAuth } from '../features/auth/useAuth'
import { logout } from '../services/firebase/authService'

export function Tasks() {
    const { user } = useAuth()

    return (
        <section>
            <h2>Mis tareas</h2>
            <p>{user ? `Sesión iniciada: ${user.email}` : 'No hay sesión iniciada'}</p>
            {user && <button onClick={logout}>Cerrar sesión</button>}
        </section>
    )
}