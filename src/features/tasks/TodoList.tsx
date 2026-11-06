import type { Task } from '../../types/task'
import './tasks.css'

interface TodoListProps {
    tasks: Task[]
}

export function TodoList({ tasks }: TodoListProps) {
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
                    <span className="task-status">
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </li>
            ))}
        </ul>
    )
}