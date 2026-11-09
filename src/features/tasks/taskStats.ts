import type { Task } from '../../types/task'

export interface TaskStats {
    total: number
    pending: number
    completed: number
}

export function getTaskStats(tasks: Task[]): TaskStats {
    const completed = tasks.filter((task) => task.completed).length

    return {
        total: tasks.length,
        pending: tasks.length - completed,
        completed,
    }
}
