import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

export default function PrivateRoute() {
  const { session, ready } = useSession()
  const location = useLocation()

  // While we don't yet know, show a small, obvious loader instead of returning null
  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // When checked and there is no session, send to sign-in with a return-to hint
  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search + location.hash)
    return <Navigate to={`/sign-in?next=${next}`} replace />
  }

  // All good → render protected content
  return <Outlet />
}
