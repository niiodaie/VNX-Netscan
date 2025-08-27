// components/PrivateRoute.tsx
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

function FullscreenSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin h-6 w-6 rounded-full border-2 border-slate-300 border-t-blue-600" />
    </div>
  )
}

export default function PrivateRoute() {
  const { session, ready } = useSession()
  const location = useLocation()

  // While the session is initializing, render a tiny spinner instead of nothing.
  if (!ready) return <FullscreenSpinner />

  // Not signed in → send to /sign-in and preserve where we were going.
  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search + location.hash)
    return <Navigate to={`/sign-in?next=${next}`} replace />
  }

  // All good → render the protected outlet
  return <Outlet />
}
