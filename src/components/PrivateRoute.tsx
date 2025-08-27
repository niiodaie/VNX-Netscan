import { Outlet, Navigate } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'

export default function PrivateRoute() {
  const { session, ready } = useSession()
  if (!ready) return null
  return session ? <Outlet /> : <Navigate to="/sign-in" replace />
}
