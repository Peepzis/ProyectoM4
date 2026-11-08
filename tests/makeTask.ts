import type { Task } from '../src/types/task'

export function makeTask(overrides: Partial<Task> = {}): Task {
    return {
        id: '1',
        title: 'Comprar yerba',
        description: '',
        completed: false,
        userId: 'usuario-1',
        createdAt: {} as Task['createdAt'],
        updatedAt: {} as Task['updatedAt'],
        ...overrides,
    }
}