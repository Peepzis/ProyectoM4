import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, type Timestamp } from 'firebase-admin/firestore'

interface TaskData {
    title: string
    description: string
    completed: boolean
    createdAt: Timestamp
}

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

async function getUserTasks(uid: string): Promise<TaskData[]> {
    const snapshot = await getFirestore()
        .collection('tasks')
        .where('userId', '==', uid)
        .get()

    return snapshot.docs
        .map((doc) => doc.data() as TaskData)
        .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
}

function formatTask(task: TaskData): string {
    return task.description
        ? `- ${task.title}: ${task.description}`
        : `- ${task.title}`
}

function formatSection(title: string, tasks: TaskData[]): string[] {
    const lines = tasks.length > 0 ? tasks.map(formatTask) : ['- Ninguna']
    return [`${title} (${tasks.length}):`, ...lines]
}

function buildSummary(tasks: TaskData[]): string {
    if (tasks.length === 0) {
        return 'No tenés tareas cargadas.'
    }

    const pending = tasks.filter((task) => !task.completed)
    const completed = tasks.filter((task) => task.completed)

    return [
        ...formatSection('Pendientes', pending),
        '',
        ...formatSection('Completadas', completed),
    ].join('\n')
}

async function sendSummaryEmail(to: string, summary: string): Promise<void> {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION
    const from = process.env.SES_FROM_EMAIL

    if (!accessKeyId || !secretAccessKey || !region || !from) {
        throw new Error('Faltan variables de entorno de AWS SES')
    }

    const client = new SESv2Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
    })

    await client.send(
        new SendEmailCommand({
            FromEmailAddress: from,
            Destination: { ToAddresses: [to] },
            Content: {
                Simple: {
                    Subject: { Data: 'Resumen de tus tareas', Charset: 'UTF-8' },
                    Body: { Text: { Data: summary, Charset: 'UTF-8' } },
                },
            },
        }),
    )
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

    let uid: string
    let email: string | null
    try {
        const decoded = await getAuth().verifyIdToken(token)
        uid = decoded.uid
        email = decoded.email ?? null
    } catch {
        res.status(401).json({ error: 'Token inválido o vencido' })
        return
    }

    if (!email) {
        res.status(400).json({ error: 'Tu cuenta no tiene un email asociado' })
        return
    }

    let summary: string
    let total: number
    try {
        const tasks = await getUserTasks(uid)
        summary = buildSummary(tasks)
        total = tasks.length
    } catch {
        res.status(500).json({ error: 'No se pudieron leer las tareas' })
        return
    }

    try {
        await sendSummaryEmail(email, summary)
    } catch {
        res.status(502).json({ error: 'No se pudo enviar el email' })
        return
    }

    res.status(200).json({ message: 'Resumen enviado', total })
}