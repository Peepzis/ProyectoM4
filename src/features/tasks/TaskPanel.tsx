import { useState } from 'react'
import type { Task } from '../../types/task'
import { paginateTasks } from './taskPagination'
import { TodoList } from './TodoList'

interface TaskPanelProps {
    title: string
    tasks: Task[]
    emptyMessage: string
    onToggle: (taskId: string, completed: boolean) => void
    onDelete: (taskId: string) => void
    onUpdate: (taskId: string, title: string, description: string) => Promise<void>
}

export function TaskPanel({
    title,
    tasks,
    emptyMessage,
    onToggle,
    onDelete,
    onUpdate,
}: TaskPanelProps) {
    const [requestedPage, setRequestedPage] = useState(1)
    const { items, page, totalPages } = paginateTasks(tasks, requestedPage)

    return (
        <div className="task-panel">
            <h3>
                {title} ({tasks.length})
            </h3>

            <TodoList
                tasks={items}
                emptyMessage={emptyMessage}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />

            {totalPages > 1 && (
                <div className="task-pagination">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setRequestedPage(page - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() => setRequestedPage(page + 1)}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}
