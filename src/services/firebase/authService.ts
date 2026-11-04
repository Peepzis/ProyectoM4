import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
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