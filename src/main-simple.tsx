import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SimpleHome from './pages/simple-home'
import AuthSignIn from './pages/auth-sign-in'
import SimpleDashboard from './pages/simple-dashboard'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import Upgrade from './pages/upgrade'
import SSLAnalyzer from './pages/ssl-analyzer'
import Lookup from './pages/lookup'
import Ports from './pages/ports'
import Monitoring from './pages/monitoring'
import Domain from './pages/domain'
import NetworkMap from './pages/network-map'
import History from './pages/history'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <SimpleHome /> },
  { path: '/sign-in', element: <AuthSignIn /> },
  { path: '/signup', element: <Signup /> },
  { path: '/profile', element: <Profile /> },
  { path: '/dashboard', element: <Navigate to="/profile" replace /> },
  { path: '/upgrade', element: <Upgrade /> },
  { path: '/ssl-analyzer', element: <SSLAnalyzer /> },
  { path: '/lookup', element: <Lookup /> },
  { path: '/ports', element: <Ports /> },
  { path: '/monitoring', element: <Monitoring /> },
  { path: '/domain', element: <Domain /> },
  { path: '/network-map', element: <NetworkMap /> },
  { path: '/history', element: <History /> },
  { path: '*', element: <Navigate to='/' replace /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)