import { SessionHeader } from '../features/auth/SessionHeader'
import { useAuth } from '../features/auth/useAuth'
import { TodoForm } from '../features/tasks/TodoForm'
import { getTaskStats } from '../features/tasks/taskStats'
import { useTasks } from '../features/tasks/useTasks'
import '../features/tasks/tasks.css'
import { createTask } from '../services/firebase/taskService'
import './home.css'

export function Home() {
    const { user } = useAuth()
    const { tasks, loading, error } = useTasks()
    const stats = getTaskStats(tasks)

    async function handleCreate(title: string, description: string) {
        if (!user) {
            throw new Error('No hay sesión iniciada')
        }
        await createTask({ title, description, userId: user.uid })
    }

    return (
        <section className="home-section">
            <SessionHeader title="Inicio" />

            {loading && <p className="task-empty">Cargando tareas...</p>}
            {error && (
                <p className="task-error" role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && (
                <dl className="task-stats">
                    <div>
                        <dt>Total</dt>
                        <dd>{stats.total}</dd>
                    </div>
                    <div>
                        <dt>Pendientes</dt>
                        <dd>{stats.pending}</dd>
                    </div>
                    <div>
                        <dt>Terminadas</dt>
                        <dd>{stats.completed}</dd>
                    </div>
                </dl>
            )}

            <TodoForm onSubmit={handleCreate} />
        </section>
    )
}
