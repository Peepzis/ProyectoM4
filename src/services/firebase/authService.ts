import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './auth'

export function registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

export function loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
    return signOut(auth)
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
}