import { Link } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <>
      <header>
        <h1>Gestor Estratégico de Tareas</h1>
        <nav>
          <Link to="/login">Iniciar sesión</Link>
          {' | '}
          <Link to="/register">Crear cuenta</Link>
          {' | '}
          <Link to="/tasks">Mis tareas</Link>
        </nav>
      </header>
      <AppRoutes />
    </>
  )
}

export default App