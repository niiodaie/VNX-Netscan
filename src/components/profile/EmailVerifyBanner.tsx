import { useCallback, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Shield, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  email: string
  redirectPath?: string // default: /sign-in
  cooldownSec?: number  // default: 30
}

export default function EmailVerifyBanner({
  email,
  redirectPath = '/sign-in',
  cooldownSec = 30,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [okMsg, setOkMsg] = useState<string | null>(null)
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // tick the cooldown once per second
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const resend = useCallback(async () => {
    setLoading(true)
    setOkMsg(null)
    setErrMsg(null)
    try {
      const appUrl =
        import.meta.env.VITE_PUBLIC_APP_URL ??
        window.location.origin

      // Supabase v2 resend for signup verification
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${appUrl}${redirectPath}`,
        },
      })

      if (error) throw error
      setOkMsg('Verification email sent. Check your inbox (and spam folder).')
      setCooldown(cooldownSec)
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Unable to send verification email.')
    } finally {
      setLoading(false)
    }
  }, [email, redirectPath, cooldownSec])

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>
            Please verify your email address <strong>{email}</strong> to unlock all features.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <Button variant="outline" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending…
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={resend}
              disabled={cooldown > 0}
              className="whitespace-nowrap"
            >
              <Mail className="w-4 h-4 mr-2" />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
            </Button>
          )}
        </div>
      </div>

      {okMsg && (
        <p className="mt-2 text-sm text-green-700">
          {okMsg}
        </p>
      )}
      {errMsg && (
        <p className="mt-2 text-sm text-red-700">
          {errMsg}
        </p>
      )}
    </div>
  )
}
