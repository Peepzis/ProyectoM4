import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { subscribeToUserTasks } from '../../services/firebase/taskService'
import type { Task } from '../../types/task'

interface TasksState {
    userId: string
    tasks: Task[]
    error: string | null
}

export function useTasks() {
    const { user } = useAuth()
    const userId = user?.uid ?? null
    const [state, setState] = useState<TasksState | null>(null)

    useEffect(() => {
        if (userId === null) {
            return undefined
        }

        return subscribeToUserTasks(
            userId,
            (tasks) => setState({ userId, tasks, error: null }),
            () =>
                setState({
                    userId,
                    tasks: [],
                    error: 'No se pudieron cargar las tareas.',
                }),
        )
    }, [userId])

    // Si el estado guardado es de otro usuario, se ignora.
    const current = state?.userId === userId ? state : null

    return {
        tasks: current?.tasks ?? [],
        loading: userId !== null && current === null,
        error: current?.error ?? null,
    }
}