import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormField } from '../../components/FormField'
import type { Task } from '../../types/task'
import { validateTaskDescription, validateTaskTitle } from './taskValidators'

interface TaskEditFormProps {
    task: Task
    onSave: (title: string, description: string) => Promise<void>
    onCancel: () => void
}

interface FormErrors {
    title: string | null
    description: string | null
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
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
            await onSave(title, description)
        } catch {
            setSubmitError('No se pudo guardar el cambio. Probá de nuevo.')
            setSubmitting(false)
        }
    }

    return (
        <form className="task-edit-form" onSubmit={handleSubmit} noValidate>
            <FormField
                id={`edit-title-${task.id}`}
                label="Título"
                value={title}
                error={errors.title}
                onChange={setTitle}
            />
            <FormField
                id={`edit-description-${task.id}`}
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

            <div className="task-edit-buttons">
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                    type="button"
                    className="task-cancel"
                    disabled={submitting}
                    onClick={onCancel}
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}