// components/PrivateRoute.tsx
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

export default function PrivateRoute({
  fallback,
}: {
  fallback?: React.ReactNode
}) {
  const { session, ready } = useSession()
  const location = useLocation()

  // While we don't yet know if the user is signed in, show a tiny loader
  if (!ready) {
    return (
      (fallback ?? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ))
    )
  }

  // Not signed in -> go to /sign-in and remember where we were trying to go
  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  // Signed in -> render protected content
  return <Outlet />
}
