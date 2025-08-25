import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/supabaseClient'
import UsernameField from '@/components/profile/UsernameField'
import EmailVerifyBanner from '@/components/profile/EmailVerifyBanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEmailVerified } from '@/hooks/useEmailVerified'
import { resendVerificationEmail } from '@/lib/auth'
import {
  User,
  Mail,
  Calendar,
  Crown,
  Settings,
  LogOut,
  Shield,
  Activity,
} from 'lucide-react'


export default function Profile() {
  const { session, ready } = useSession()
  const { verifying, emailVerified, refresh } = useEmailVerified(session)


export default function Profile() {
  const { session, ready } = useSession()
  const navigate = useNavigate()

  
  const [verifying, setVerifying] = useState(true)
  const [userEmailConfirmedAt, setUserEmailConfirmedAt] = useState<string | null>(null)
  const [autoResendOk, setAutoResendOk] = useState<string | null>(null)
  const [autoResendErr, setAutoResendErr] = useState<string | null>(null)

  const handleResend = async () => {
    if (!session?.user?.email) return
    const result = await resendVerificationEmail(session.user.email)
    if (result.ok) {
      console.log('Verification email sent')
    } else {
      console.error(result.error)

  // If no session after a small delay, go to /sign-in
  useEffect(() => {
    if (!ready) return
    if (session) return
    const t = setTimeout(() => {
      if (!session) navigate('/sign-in', { replace: true })
    }, 800)
    return () => clearTimeout(t)
  }, [ready, session, navigate])

  // Refresh the user object once to get latest email_confirmed_at & metadata
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!session) return
      setVerifying(true)
      const { data } = await supabase.auth.getUser()
      if (!cancelled) {
        setUserEmailConfirmedAt(data.user?.email_confirmed_at ?? null)
        setVerifying(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [session])

  // Auto-resend once per browser session if unverified
  useEffect(() => {
    const email = session?.user?.email
    if (!email || !session) return
    const emailVerified = !!userEmailConfirmedAt
    if (emailVerified) return

    const key = `nl_auto_resend_${session.user.id}`
    if (sessionStorage.getItem(key)) return

    ;(async () => {
      try {
        const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: `${appUrl}/sign-in` },
        })
        if (error) throw error
        setAutoResendOk('We sent you a fresh verification email.')
        sessionStorage.setItem(key, '1')
      } catch (e: any) {
        setAutoResendErr(e?.message ?? 'Could not send verification email.')
        sessionStorage.setItem(key, '1')
      }
    })()
  }, [session, userEmailConfirmedAt])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/sign-in', { replace: true })
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Redirecting to sign in...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    )
  }

  const user = session.user
  const fullName =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    user.email?.split('@')[0] ||
    'User'
  const initial = (user.email?.charAt(0) || 'U').toUpperCase()
  const joined = useMemo(() => new Date(user.created_at).toLocaleDateString(), [user.created_at])
  const emailVerified = !!userEmailConfirmedAt

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile</h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </div>

          {/* Auto-resend status (only if unverified) */}
          {!emailVerified && (autoResendOk || autoResendErr) && (
            <div
              className={`mb-4 rounded-lg border px-4 py-3 ${
                autoResendOk
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {autoResendOk ?? autoResendErr}
            </div>
          )}

          {/* Email verification banner (manual resend) */}
          {!emailVerified && (
            <div className="mb-6">
              <EmailVerifyBanner email={user.email!} redirectPath="/sign-in" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={fullName} />
                    <AvatarFallback className="text-lg">{initial}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    {fullName}
                  </CardTitle>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="secondary">Free Plan</Badge>
                    {emailVerified ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Email Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Verify Email
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    Joined {joined}
                  </div>
                  {verifying && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Shield className="w-4 h-4" />
                      Checking verification…
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Details */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <UsernameField
                    userId={user.id}
                    initial={(user as any).user_metadata?.username ?? undefined}
                  />

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-800">Email Address</h3>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-800">Password</h3>
                      <p className="text-sm text-slate-600">••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/dashboard">
                      <Button className="w-full justify-start" variant="outline">
                        <Activity className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link to="/upgrade">
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats (placeholder) */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">127</div>
                      <div className="text-sm text-slate-600">IP Lookups</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">43</div>
                      <div className="text-sm text-slate-600">Port Scans</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">89</div>
                      <div className="text-sm text-slate-600">Domain Queries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sign Out */}
              <Card className="shadow-lg border-0">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
