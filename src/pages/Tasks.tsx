import { useState } from 'react'
import { SessionHeader } from '../features/auth/SessionHeader'
import { useAuth } from '../features/auth/useAuth'
import { TaskPanel } from '../features/tasks/TaskPanel'
import { useSendSummary } from '../features/tasks/useSendSummary'
import { useTasks } from '../features/tasks/useTasks'
import {
    deleteTask,
    setTaskCompleted,
    updateTask,
} from '../services/firebase/taskService'
import './tasks-page.css'

export function Tasks() {
    const { user } = useAuth()
    const { tasks, loading, error } = useTasks()
    const { status: summaryStatus, sendSummary } = useSendSummary()
    const [actionError, setActionError] = useState<string | null>(null)

    const pendingTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    async function handleUpdate(
        taskId: string,
        title: string,
        description: string,
    ) {
        await updateTask(taskId, title, description)
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
        <section className="tasks-page">
            <SessionHeader title="Mis tareas" />

            {user && (
                <div>
                    <button
                        type="button"
                        onClick={sendSummary}
                        disabled={summaryStatus === 'sending'}
                    >
                        {summaryStatus === 'sending'
                            ? 'Enviando...'
                            : 'Enviar resumen por email'}
                    </button>
                    {summaryStatus === 'success' && (
                        <p className="task-empty" role="status">
                            Resumen enviado a {user.email}. Revisá también tu
                            carpeta de correo no deseado.
                        </p>
                    )}
                    {summaryStatus === 'error' && (
                        <p className="task-error" role="alert">
                            No se pudo enviar el resumen. Probá de nuevo.
                        </p>
                    )}
                </div>
            )}

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
                <>
                    <TaskPanel
                        title="Pendientes"
                        tasks={pendingTasks}
                        emptyMessage="No tenés tareas pendientes."
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                    <TaskPanel
                        title="Finalizadas"
                        tasks={completedTasks}
                        emptyMessage="Todavía no finalizaste ninguna tarea."
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                </>
            )}
        </section>
    )
}
