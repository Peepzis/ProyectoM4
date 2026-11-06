export function validateTaskTitle(title: string): string | null {
    const length = title.trim().length

    if (length === 0) {
        return 'El título es obligatorio.'
    }
    if (length > 100) {
        return 'El título no puede superar los 100 caracteres.'
    }
    return null
}

export function validateTaskDescription(description: string): string | null {
    if (description.trim().length > 500) {
        return 'La descripción no puede superar los 500 caracteres.'
    }
    return null
}