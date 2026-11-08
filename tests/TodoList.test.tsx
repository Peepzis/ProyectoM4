import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoList } from '../src/features/tasks/TodoList'
import type { Task } from '../src/types/task'

function makeTask(overrides: Partial<Task> = {}): Task {
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

function renderList(tasks: Task[]) {
    const handlers = {
        onToggle: vi.fn(),
        onDelete: vi.fn(),
        onUpdate: vi.fn().mockResolvedValue(undefined),
    }
    render(<TodoList tasks={tasks} {...handlers} />)
    return handlers
}

describe('TodoList', () => {
    it('muestra un mensaje cuando no hay tareas', () => {
        renderList([])

        expect(
            screen.getByText(
                'Todavía no tenés tareas. Creá la primera con el formulario.',
            ),
        ).toBeInTheDocument()
    })

    it('muestra el título y la descripción de cada tarea', () => {
        renderList([
            makeTask({
                id: '1',
                title: 'Comprar yerba',
                description: 'Para el mate',
            }),
            makeTask({ id: '2', title: 'Pagar la luz' }),
        ])

        expect(
            screen.getByRole('heading', { name: 'Comprar yerba' }),
        ).toBeInTheDocument()
        expect(screen.getByText('Para el mate')).toBeInTheDocument()
        expect(
            screen.getByRole('heading', { name: 'Pagar la luz' }),
        ).toBeInTheDocument()
        expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('indica cuáles tareas están pendientes y cuáles completadas', () => {
        renderList([
            makeTask({ id: '1', title: 'Comprar yerba', completed: false }),
            makeTask({ id: '2', title: 'Pagar la luz', completed: true }),
        ])

        expect(screen.getByLabelText('Pendiente')).not.toBeChecked()
        expect(screen.getByLabelText('Completada')).toBeChecked()
    })

    it('llama a onToggle con el id y el estado nuevo al tildar una tarea', async () => {
        const user = userEvent.setup()
        const { onToggle } = renderList([
            makeTask({ id: '1', completed: false }),
        ])

        await user.click(screen.getByLabelText('Pendiente'))

        expect(onToggle).toHaveBeenCalledWith('1', true)
    })

    it('llama a onDelete con el id al apretar Borrar', async () => {
        const user = userEvent.setup()
        const { onDelete } = renderList([
            makeTask({ id: '7', title: 'Comprar yerba' }),
        ])

        await user.click(
            screen.getByRole('button', { name: 'Borrar la tarea Comprar yerba' }),
        )

        expect(onDelete).toHaveBeenCalledWith('7')
    })
})