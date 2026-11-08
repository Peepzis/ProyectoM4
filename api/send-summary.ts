import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function initFirebaseAdmin() {
    if (getApps().length > 0) {
        return
    }

    const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_B64
    if (!encoded) {
        throw new Error('Falta la variable FIREBASE_SERVICE_ACCOUNT_B64')
    }

    const json = Buffer.from(encoded, 'base64').toString('utf8')
    initializeApp({ credential: cert(JSON.parse(json)) })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        res.status(405).json({ error: 'Método no permitido' })
        return
    }

    const authorization = req.headers.authorization
    if (!authorization?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Falta el token de sesión' })
        return
    }
    const token = authorization.slice('Bearer '.length)

    try {
        initFirebaseAdmin()
    } catch {
        res.status(500).json({ error: 'Error de configuración del servidor' })
        return
    }

    try {
        const decoded = await getAuth().verifyIdToken(token)
        res.status(200).json({
            message: 'Token válido',
            uid: decoded.uid,
            email: decoded.email ?? null,
        })
    } catch {
        res.status(401).json({ error: 'Token inválido o vencido' })
    }
}