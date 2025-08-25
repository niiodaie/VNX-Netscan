// components/profile/EmailVerifyBanner.tsx
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'

export default function EmailVerifyBanner({ email }: { email: string }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const resend = async () => {
    setSending(true); setErr(null)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/sign-in` },
    })
    setSending(false)
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertDescription className="flex items-center gap-3">
        <span>Verify your email to unlock all features.</span>
        {!sent ? (
          <Button size="sm" onClick={resend} disabled={sending}>
            {sending ? 'Sending…' : 'Resend link'}
          </Button>
        ) : (
          <span className="text-green-700">Verification email sent.</span>
        )}
        {err && <span className="text-red-600">{err}</span>}
      </AlertDescription>
    </Alert>
  )
}
