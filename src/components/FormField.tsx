interface FormFieldProps {
    id: string
    label: string
    type?: string
    value: string
    error?: string | null
    autoComplete?: string
    onChange: (value: string) => void
}

export function FormField({
    id,
    label,
    type = 'text',
    value,
    error,
    autoComplete,
    onChange,
}: FormFieldProps) {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                autoComplete={autoComplete}
                aria-invalid={error ? true : undefined}
                onChange={(event) => onChange(event.target.value)}
            />
            {error && (
                <p className="form-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}