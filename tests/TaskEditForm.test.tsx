import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskEditForm } from '../src/features/tasks/TaskEditForm'
import { makeTask } from './makeTask'

function renderForm(onSave = vi.fn().mockResolvedValue(undefined)) {
    const onCancel = vi.fn()
    const task = makeTask({
        title: 'Comprar yerba',
        description: 'Para el mate',
    })
    render(<TaskEditForm task={task} onSave={onSave} onCancel={onCancel} />)
    return { onSave, onCancel }
}

describe('TaskEditForm', () => {
    it('muestra los datos actuales de la tarea', () => {
        renderForm()

        expect(screen.getByLabelText('Título')).toHaveValue('Comprar yerba')
        expect(screen.getByLabelText('Descripción (opcional)')).toHaveValue(
            'Para el mate',
        )
    })

    it('no guarda y muestra un error si el título queda vacío', async () => {
        const user = userEvent.setup()
        const { onSave } = renderForm()

        await user.clear(screen.getByLabelText('Título'))
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(
            screen.getByText('El título es obligatorio.'),
        ).toBeInTheDocument()
        expect(onSave).not.toHaveBeenCalled()
    })

    it('llama a onSave con los datos nuevos', async () => {
        const user = userEvent.setup()
        const { onSave } = renderForm()

        const titleInput = screen.getByLabelText('Título')
        await user.clear(titleInput)
        await user.type(titleInput, 'Comprar café')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(onSave).toHaveBeenCalledWith('Comprar café', 'Para el mate')
    })

    it('muestra un error y deja volver a intentar si falla el guardado', async () => {
        const user = userEvent.setup()
        const { onSave } = renderForm(
            vi.fn().mockRejectedValue(new Error('falló')),
        )

        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'No se pudo guardar el cambio. Probá de nuevo.',
        )
        expect(onSave).toHaveBeenCalledTimes(1)
        expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled()
    })

    it('llama a onCancel al apretar Cancelar, sin guardar', async () => {
        const user = userEvent.setup()
        const { onSave, onCancel } = renderForm()

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(onCancel).toHaveBeenCalledTimes(1)
        expect(onSave).not.toHaveBeenCalled()
    })
})