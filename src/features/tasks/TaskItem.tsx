import { useState } from 'react'
import type { Task } from '../../types/task'
import { TaskEditForm } from './TaskEditForm'

interface TaskItemProps {
    task: Task
    onToggle: (taskId: string, completed: boolean) => void
    onDelete: (taskId: string) => void
    onUpdate: (taskId: string, title: string, description: string) => Promise<void>
}

export function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
    const [editing, setEditing] = useState(false)

    async function handleSave(title: string, description: string) {
        await onUpdate(task.id, title, description)
        setEditing(false)
    }

    if (editing) {
        return (
            <li className="task-item">
                <TaskEditForm
                    task={task}
                    onSave={handleSave}
                    onCancel={() => setEditing(false)}
                />
            </li>
        )
    }

    return (
        <li className={task.completed ? 'task-item task-item--done' : 'task-item'}>
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-actions">
                <label className="task-status task-toggle">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id, !task.completed)}
                    />
                    {task.completed ? 'Completada' : 'Pendiente'}
                </label>
                <div className="task-button-group">
                    <button
                        type="button"
                        className="task-edit-button"
                        aria-label={`Editar la tarea ${task.title}`}
                        onClick={() => setEditing(true)}
                    >
                        Editar
                    </button>
                    <button
                        type="button"
                        className="task-delete"
                        aria-label={`Borrar la tarea ${task.title}`}
                        onClick={() => onDelete(task.id)}
                    >
                        Borrar
                    </button>
                </div>
            </div>
        </li>
    )
}