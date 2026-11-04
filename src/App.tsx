import { useAuth } from './features/auth/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Verificando sesión...</p>
  }

  return (
    <main>
      <h1>Gestor Estratégico de Tareas</h1>
      <p>{user ? `Sesión iniciada: ${user.email}` : 'No hay sesión iniciada'}</p>
    </main>
  )
}

export default App