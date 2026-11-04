import { useState } from 'react'
import { useAuth } from './features/auth/useAuth'
import { logout } from './services/firebase/authService'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

type AuthMode = 'login' | 'register'

function App() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')

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
        <>
          {mode === 'login' ? <Login /> : <Register />}
          <p>
            {mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </p>
        </>
      )}
    </main>
  )
}

export default App