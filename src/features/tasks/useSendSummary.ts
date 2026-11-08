import { useState } from 'react'
import { useAuth } from '../auth/useAuth'

export type SummaryStatus = 'idle' | 'sending' | 'success' | 'error'

export function useSendSummary() {
    const { user } = useAuth()
    const [status, setStatus] = useState<SummaryStatus>('idle')

    async function sendSummary() {
        if (!user) {
            setStatus('error')
            return
        }

        setStatus('sending')
        try {
            const idToken = await user.getIdToken()
            const response = await fetch('/api/send-summary', {
                method: 'POST',
                headers: { Authorization: `Bearer ${idToken}` },
            })
            setStatus(response.ok ? 'success' : 'error')
        } catch {
            setStatus('error')
        }
    }

    return { status, sendSummary }
}