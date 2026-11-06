import type { Task } from '../../types/task'
import { TaskItem } from './TaskItem'
import './tasks.css'

interface TodoListProps {
    tasks: Task[]
    onToggle: (taskId: string, completed: boolean) => void
    onDelete: (taskId: string) => void
    onUpdate: (taskId: string, title: string, description: string) => Promise<void>
}

export function TodoList({ tasks, onToggle, onDelete, onUpdate }: TodoListProps) {
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
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </ul>
    )
}