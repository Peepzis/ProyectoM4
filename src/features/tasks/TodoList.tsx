import type { Task } from '../../types/task'
import './tasks.css'

interface TodoListProps {
    tasks: Task[]
    onToggle: (taskId: string, completed: boolean) => void
    onDelete: (taskId: string) => void
}

export function TodoList({ tasks, onToggle, onDelete }: TodoListProps) {
    if (tasks.length === 0) {
        return (
            <p className="task-empty">
                Todavía no tenés tareas. Creá la primera con el formulario.
            </p>
        )
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className={task.completed ? 'task-item task-item--done' : 'task-item'}
                >
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
                        <button
                            type="button"
                            className="task-delete"
                            aria-label={`Borrar la tarea ${task.title}`}
                            onClick={() => onDelete(task.id)}
                        >
                            Borrar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}