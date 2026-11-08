import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('entorno de tests', () => {
    it('renderiza un componente y encuentra su texto', () => {
        render(<p>Hola, tests</p>)
        expect(screen.getByText('Hola, tests')).toBeInTheDocument()
    })
})