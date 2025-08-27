// components/PrivateRoute.tsx
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

export default function PrivateRoute() {
  const { session, ready } = useSession()
  const location = useLocation()

  // Helpful debug during integration
  console.debug('[PrivateRoute] ready:', ready, 'session:', !!session, 'path:', location.pathname)

  // While we don't yet know if a session exists, render a lightweight loader
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Checking your session…
      </div>
    )
  }

  // If there is a valid session, render the nested protected route
  if (session) {
    return <Outlet />
  }

  // Otherwise go to sign-in and remember where the user wanted to go
  const next = encodeURIComponent(location.pathname + location.search + location.hash)
  return <Navigate to={`/sign-in?next=${next}`} replace />
}
