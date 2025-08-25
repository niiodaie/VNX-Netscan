import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

const USERNAME_RE = /^[a-z0-9_]{3,24}$/i

export default function UsernameField({ userId, initial }: { userId: string; initial?: string }) {
  const [value, setValue] = useState(initial ?? '')
  const [status, setStatus] = useState<'idle'|'checking'|'ok'|'taken'|'invalid'|'saving'|'error'>('idle')
  const [msg, setMsg] = useState('')

  const debounced = useMemo(() => {
    let t: any
    return (fn: () => void) => { clearTimeout(t); t = setTimeout(fn, 350) }
  }, [])

  // live availability check
  useEffect(() => {
    if (!value || value === initial) { setStatus('idle'); setMsg(''); return }
    if (!USERNAME_RE.test(value)) { setStatus('invalid'); setMsg('Use 3–24 chars: letters, numbers, underscores.'); return }
    setStatus('checking'); setMsg('Checking availability...')
    debounced(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', value.toLowerCase())
        .limit(1)
        .maybeSingle()
      if (error) { setStatus('error'); setMsg(error.message); return }
      if (data && data.id !== userId) { setStatus('taken'); setMsg('That username is taken.'); return }
      setStatus('ok'); setMsg('Available ✓')
    })
  }, [value, initial, userId, debounced])

  const save = async () => {
    if (status !== 'ok' && value !== initial) return
    setStatus('saving'); setMsg('Saving…')
    const { error } = await supabase.from('profiles')
      .update({ username: value.toLowerCase() })
      .eq('id', userId)
    if (error) { setStatus('error'); setMsg(error.message) }
    else { setStatus('idle'); setMsg('Saved ✓') }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <div className="flex gap-2">
        <Input
          id="username"
          value={value}
          onChange={e => setValue(e.target.value.trim())}
          placeholder="yourname"
          className="max-w-sm"
        />
        <Button type="button" onClick={save} disabled={value===initial || !(status==='ok' || status==='idle')}>
          Save
        </Button>
      </div>
      {status !== 'idle' && msg && (
        <Alert className={status==='ok' || msg.includes('Saved') ? 'border-green-200 bg-green-50' : 'border-slate-200'}>
          <AlertDescription>{msg}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-slate-500">Public handle for sharing (a–z, 0–9, _).</p>
    </div>
  )
}
