import { useAuth } from './features/auth/useAuth'
import { logout } from './services/firebase/authService'
import { Register } from './pages/Register'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Verificando sesión...</p>
  }

  return (
    <main>
      <h1>Gestor Estratégico de Tareas</h1>
      {user ? (
        <>
          <p>Sesión iniciada: {user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <Register />
      )}
    </main>
  )
}

export default App