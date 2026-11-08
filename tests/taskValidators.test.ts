import { describe, expect, it } from 'vitest'
import {
    validateTaskDescription,
    validateTaskTitle,
} from '../src/features/tasks/taskValidators'

describe('validateTaskTitle', () => {
    it('acepta un título normal', () => {
        expect(validateTaskTitle('Comprar yerba')).toBeNull()
    })

    it('rechaza un título vacío', () => {
        expect(validateTaskTitle('')).toBe('El título es obligatorio.')
    })

    it('rechaza un título con solo espacios', () => {
        expect(validateTaskTitle('     ')).toBe('El título es obligatorio.')
    })

    it('ignora los espacios al principio y al final', () => {
        expect(validateTaskTitle('  Comprar yerba  ')).toBeNull()
    })

    it('acepta un título de exactamente 100 caracteres', () => {
        expect(validateTaskTitle('a'.repeat(100))).toBeNull()
    })

    it('rechaza un título de 101 caracteres', () => {
        expect(validateTaskTitle('a'.repeat(101))).toBe(
            'El título no puede superar los 100 caracteres.',
        )
    })
})

describe('validateTaskDescription', () => {
    it('acepta una descripción vacía', () => {
        expect(validateTaskDescription('')).toBeNull()
    })

    it('acepta una descripción de exactamente 500 caracteres', () => {
        expect(validateTaskDescription('a'.repeat(500))).toBeNull()
    })

    it('rechaza una descripción de 501 caracteres', () => {
        expect(validateTaskDescription('a'.repeat(501))).toBe(
            'La descripción no puede superar los 500 caracteres.',
        )
    })
})