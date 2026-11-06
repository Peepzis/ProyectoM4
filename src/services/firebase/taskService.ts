import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from './firestore'
import type { Task } from '../../types/task'

const tasksCollection = collection(db, 'tasks')

interface NewTaskData {
    title: string
    description: string
    userId: string
}

export async function createTask({
    title,
    description,
    userId,
}: NewTaskData): Promise<void> {
    await addDoc(tasksCollection, {
        title: title.trim(),
        description: description.trim(),
        completed: false,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
}

export async function setTaskCompleted(
    taskId: string,
    completed: boolean,
): Promise<void> {
    await updateDoc(doc(db, 'tasks', taskId), {
        completed,
        updatedAt: serverTimestamp(),
    })
}

export function subscribeToUserTasks(
    userId: string,
    onChange: (tasks: Task[]) => void,
    onError: (error: Error) => void,
): Unsubscribe {
    const userTasksQuery = query(tasksCollection, where('userId', '==', userId))

    return onSnapshot(
        userTasksQuery,
        (snapshot) => {
            const tasks = snapshot.docs.map((taskDoc) => {
                // Firestore devuelve datos sin tipo; las reglas garantizan esta forma.
                return {
                    id: taskDoc.id,
                    ...taskDoc.data({ serverTimestamps: 'estimate' }),
                } as Task
            })

            // Más nuevas primero. Se ordena acá para no necesitar un índice compuesto.
            tasks.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

            onChange(tasks)
        },
        onError,
    )
}