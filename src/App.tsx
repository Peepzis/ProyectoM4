import { Link } from 'react-router-dom'
import { useAuth } from './features/auth/useAuth'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  const { user } = useAuth()

  return (
    <div className="app-shell">
      <header>
        <h1>Gestor Estratégico de Tareas</h1>
        {user && (
          <nav>
            <Link to="/">Inicio</Link>
            {' | '}
            <Link to="/tasks">Mis tareas</Link>
          </nav>
        )}
      </header>
      <main className="app-main">
        <AppRoutes />
      </main>
      <footer className="app-footer">
        <span>TodoApi • Ocean Edition</span>
      </footer>
    </div>
  )
}

export default App