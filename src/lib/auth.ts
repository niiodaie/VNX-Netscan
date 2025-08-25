import { supabase } from './supabaseClient'

/**
 * Resend a verification email to a user.
 * @param email - the user's email
 * @param redirectPath - path after clicking link (default `/sign-in`)
 */
export async function resendVerificationEmail(
  email: string,
  redirectPath: string = '/sign-in'
): Promise<{ ok: boolean; error?: string }> {
  try {
    const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${appUrl}${redirectPath}` },
    })
    if (error) throw error
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Unable to send verification email' }
  }
}
