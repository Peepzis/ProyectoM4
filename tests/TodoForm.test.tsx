import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoForm } from '../src/features/tasks/TodoForm'

describe('TodoForm', () => {
    it('muestra los campos y el botón para agregar', () => {
        render(<TodoForm onSubmit={vi.fn().mockResolvedValue(undefined)} />)

        expect(screen.getByLabelText('Título')).toBeInTheDocument()
        expect(
            screen.getByLabelText('Descripción (opcional)'),
        ).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: 'Agregar tarea' }),
        ).toBeInTheDocument()
    })

    it('no envía y muestra un error si el título está vacío', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)
        render(<TodoForm onSubmit={onSubmit} />)

        await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

        expect(
            screen.getByText('El título es obligatorio.'),
        ).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('envía los datos y limpia el formulario cuando todo es válido', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockResolvedValue(undefined)
        render(<TodoForm onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Título'), 'Comprar yerba')
        await user.type(
            screen.getByLabelText('Descripción (opcional)'),
            'Para el mate',
        )
        await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

        expect(onSubmit).toHaveBeenCalledWith('Comprar yerba', 'Para el mate')
        await waitFor(() =>
            expect(screen.getByLabelText('Título')).toHaveValue(''),
        )
        expect(screen.getByLabelText('Descripción (opcional)')).toHaveValue('')
    })

    it('muestra un error y conserva lo escrito si falla el guardado', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn().mockRejectedValue(new Error('falló'))
        render(<TodoForm onSubmit={onSubmit} />)

        await user.type(screen.getByLabelText('Título'), 'Comprar yerba')
        await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'No se pudo guardar la tarea. Probá de nuevo.',
        )
        expect(screen.getByLabelText('Título')).toHaveValue('Comprar yerba')
    })
})