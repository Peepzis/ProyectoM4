import type { Task } from '../../types/task'

export const TASKS_PER_PAGE = 3

export interface PaginatedTasks {
    items: Task[]
    page: number
    totalPages: number
}

export function paginateTasks(
    tasks: Task[],
    requestedPage: number,
    perPage: number = TASKS_PER_PAGE,
): PaginatedTasks {
    const totalPages = Math.max(1, Math.ceil(tasks.length / perPage))
    const page = Math.min(Math.max(1, requestedPage), totalPages)
    const start = (page - 1) * perPage

    return {
        items: tasks.slice(start, start + perPage),
        page,
        totalPages,
    }
}
