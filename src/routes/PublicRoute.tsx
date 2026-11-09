import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

export function PublicRoute() {
    const { user, loading } = useAuth()

    if (loading) {
        return <p>Verificando sesión...</p>
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}