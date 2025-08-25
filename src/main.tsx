import AuthCallback from '@/pages/AuthCallback'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Layout Components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Pages
import Home from '@/pages/Home'
import AuthSignIn from '@/pages/auth-sign-in'
import AuthSignUp from '@/pages/auth-sign-up'
import Profile from '@/pages/Profile'
import Dashboard from '@/pages/Dashboard'
import DemoDashboard from '@/pages/DemoDashboard'
import Upgrade from '@/pages/Upgrade'
import Support from '@/pages/Support'
import NotFound from '@/pages/NotFound'

// Auth guard
import PrivateRoute from '@/components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<AuthSignIn />} />
            <Route path="/sign-up" element={<AuthSignUp />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Route>

            {/* Public extras */}
            <Route path="/demo-dashboard" element={<DemoDashboard />} />
            <Route path="/demo" element={<DemoDashboard />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
