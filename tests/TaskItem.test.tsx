import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskItem } from '../src/features/tasks/TaskItem'
import type { Task } from '../src/types/task'
import { makeTask } from './makeTask'

function renderItem(task: Task) {
    const handlers = {
        onToggle: vi.fn(),
        onDelete: vi.fn(),
        onUpdate: vi.fn().mockResolvedValue(undefined),
    }
    render(
        <ul>
            <TaskItem task={task} {...handlers} />
        </ul>,
    )
    return handlers
}

const editButtonName = 'Editar la tarea Comprar yerba'

describe('TaskItem', () => {
    it('muestra la tarea con sus botones de editar y borrar', () => {
        renderItem(
            makeTask({ title: 'Comprar yerba', description: 'Para el mate' }),
        )

        expect(
            screen.getByRole('heading', { name: 'Comprar yerba' }),
        ).toBeInTheDocument()
        expect(screen.getByText('Para el mate')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: editButtonName }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Borrar la tarea Comprar yerba' }),
        ).toBeInTheDocument()
    })

    it('muestra el formulario de edición al apretar Editar', async () => {
        const user = userEvent.setup()
        renderItem(makeTask({ title: 'Comprar yerba' }))

        await user.click(screen.getByRole('button', { name: editButtonName }))

        expect(screen.getByLabelText('Título')).toHaveValue('Comprar yerba')
        expect(
            screen.queryByRole('button', { name: editButtonName }),
        ).not.toBeInTheDocument()
    })

    it('llama a onUpdate con el id y los datos nuevos, y vuelve a la vista normal', async () => {
        const user = userEvent.setup()
        const { onUpdate } = renderItem(
            makeTask({ id: '7', title: 'Comprar yerba' }),
        )

        await user.click(screen.getByRole('button', { name: editButtonName }))
        const titleInput = screen.getByLabelText('Título')
        await user.clear(titleInput)
        await user.type(titleInput, 'Comprar café')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onUpdate).toHaveBeenCalledWith('7', 'Comprar café', '')
        expect(
            await screen.findByRole('button', { name: editButtonName }),
        ).toBeInTheDocument()
        expect(screen.queryByLabelText('Título')).not.toBeInTheDocument()
    })

    it('vuelve a la vista normal al cancelar, sin llamar a onUpdate', async () => {
        const user = userEvent.setup()
        const { onUpdate } = renderItem(makeTask({ title: 'Comprar yerba' }))

        await user.click(screen.getByRole('button', { name: editButtonName }))
        await user.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(
            screen.getByRole('button', { name: editButtonName }),
        ).toBeInTheDocument()
        expect(onUpdate).not.toHaveBeenCalled()
    })
})