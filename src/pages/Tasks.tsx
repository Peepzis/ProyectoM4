import { useState } from 'react'
import { useAuth } from '../features/auth/useAuth'
import { TodoForm } from '../features/tasks/TodoForm'
import { TodoList } from '../features/tasks/TodoList'
import { useTasks } from '../features/tasks/useTasks'
import { logout } from '../services/firebase/authService'
import {
    createTask,
    deleteTask,
    setTaskCompleted,
} from '../services/firebase/taskService'

export function Tasks() {
    const { user } = useAuth()
    const { tasks, loading, error } = useTasks()
    const [actionError, setActionError] = useState<string | null>(null)

    async function handleCreate(title: string, description: string) {
        if (!user) {
            throw new Error('No hay sesión iniciada')
        }
        await createTask({ title, description, userId: user.uid })
    }

    async function handleToggle(taskId: string, completed: boolean) {
        setActionError(null)
        try {
            await setTaskCompleted(taskId, completed)
        } catch {
            setActionError('No se pudo actualizar la tarea. Probá de nuevo.')
        }
    }

    async function handleDelete(taskId: string) {
        if (!window.confirm('¿Seguro que querés borrar esta tarea?')) {
            return
        }
        setActionError(null)
        try {
            await deleteTask(taskId)
        } catch {
            setActionError('No se pudo borrar la tarea. Probá de nuevo.')
        }
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
            {actionError && (
                <p className="task-error" role="alert">
                    {actionError}
                </p>
            )}
            {!loading && !error && (
                <TodoList
                    tasks={tasks}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            )}
        </section>
    )
}