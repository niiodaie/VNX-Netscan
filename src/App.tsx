import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import SignIn from '@/pages/auth-sign-in'
import SignUp from '@/pages/auth-sign-up'
import Profile from '@/pages/Profile'
import PrivateRoute from '@/components/PrivateRoute'
import AuthCallback from '@/pages/AuthCallback'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<PrivateRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>
    </Routes>
  )
}
