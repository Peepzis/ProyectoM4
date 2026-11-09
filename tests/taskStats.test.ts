import { describe, expect, it } from 'vitest'
import { getTaskStats } from '../src/features/tasks/taskStats'
import { makeTask } from './makeTask'

describe('getTaskStats', () => {
    it('devuelve todo en cero si no hay tareas', () => {
        expect(getTaskStats([])).toEqual({
            total: 0,
            pending: 0,
            completed: 0,
        })
    })

    it('cuenta como pendientes las tareas sin completar', () => {
        const tasks = [makeTask({ id: '1' }), makeTask({ id: '2' })]

        expect(getTaskStats(tasks)).toEqual({
            total: 2,
            pending: 2,
            completed: 0,
        })
    })

    it('separa pendientes y completadas', () => {
        const tasks = [
            makeTask({ id: '1' }),
            makeTask({ id: '2', completed: true }),
            makeTask({ id: '3', completed: true }),
        ]

        expect(getTaskStats(tasks)).toEqual({
            total: 3,
            pending: 1,
            completed: 2,
        })
    })
})
