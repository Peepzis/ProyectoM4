import { useAuth } from '../features/auth/useAuth'
import { TodoForm } from '../features/tasks/TodoForm'
import { TodoList } from '../features/tasks/TodoList'
import { useTasks } from '../features/tasks/useTasks'
import { logout } from '../services/firebase/authService'
import { createTask } from '../services/firebase/taskService'

export function Tasks() {
    const { user } = useAuth()
    const { tasks, loading, error } = useTasks()

    async function handleCreate(title: string, description: string) {
        if (!user) {
            throw new Error('No hay sesión iniciada')
        }
        await createTask({ title, description, userId: user.uid })
    }

    return (
        <section>
            <div className="tasks-header">
                <h2>Mis tareas</h2>
                <p>
                    {user ? `Sesión iniciada: ${user.email}` : 'No hay sesión iniciada'}
                </p>
                {user && (
                    <button className="logout-button" onClick={logout}>
                        Cerrar sesión
                    </button>
                )}
            </div>

            <TodoForm onSubmit={handleCreate} />

            {loading && <p className="task-empty">Cargando tareas...</p>}
            {error && (
                <p className="task-error" role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && <TodoList tasks={tasks} />}
        </section>
    )
}