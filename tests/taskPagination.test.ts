import { describe, expect, it } from 'vitest'
import { paginateTasks } from '../src/features/tasks/taskPagination'
import { makeTask } from './makeTask'

const tasks = ['1', '2', '3', '4', '5', '6', '7'].map((id) => makeTask({ id }))

function ids(page: number) {
    return paginateTasks(tasks, page).items.map((task) => task.id)
}

describe('paginateTasks', () => {
    it('devuelve una página vacía si no hay tareas', () => {
        expect(paginateTasks([], 1)).toEqual({
            items: [],
            page: 1,
            totalPages: 1,
        })
    })

    it('devuelve las primeras 3 tareas en la página 1', () => {
        expect(ids(1)).toEqual(['1', '2', '3'])
    })

    it('devuelve las tareas que correspondan a cada página', () => {
        expect(ids(2)).toEqual(['4', '5', '6'])
        expect(ids(3)).toEqual(['7'])
    })

    it('calcula la cantidad total de páginas', () => {
        expect(paginateTasks(tasks, 1).totalPages).toBe(3)
    })

    it('vuelve a la última página si la pedida ya no existe', () => {
        expect(paginateTasks(tasks, 9).page).toBe(3)
    })
})
