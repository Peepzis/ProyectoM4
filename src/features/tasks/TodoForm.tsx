import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormField } from '../../components/FormField'
import { validateTaskDescription, validateTaskTitle } from './taskValidators'

interface TodoFormProps {
    onSubmit: (title: string, description: string) => Promise<void>
}

interface FormErrors {
    title: string | null
    description: string | null
}

export function TodoForm({ onSubmit }: TodoFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState<FormErrors>({
        title: null,
        description: null,
    })
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitError(null)

        const newErrors: FormErrors = {
            title: validateTaskTitle(title),
            description: validateTaskDescription(description),
        }
        setErrors(newErrors)

        if (newErrors.title || newErrors.description) {
            return
        }

        setSubmitting(true)
        try {
            await onSubmit(title, description)
            setTitle('')
            setDescription('')
        } catch {
            setSubmitError('No se pudo guardar la tarea. Probá de nuevo.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Nueva tarea</h2>

            <FormField
                id="task-title"
                label="Título"
                value={title}
                error={errors.title}
                onChange={setTitle}
            />
            <FormField
                id="task-description"
                label="Descripción (opcional)"
                value={description}
                error={errors.description}
                onChange={setDescription}
            />

            {submitError && (
                <p className="form-error" role="alert">
                    {submitError}
                </p>
            )}

            <button type="submit" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Agregar tarea'}
            </button>
        </form>
    )
}