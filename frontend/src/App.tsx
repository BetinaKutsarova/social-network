import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/login/login'
import { Register } from './pages/register/register'
import { Dashboard } from './pages/dashboard/dashboard'
import { ProtectedRoute } from './components/other/protectedRoute'
import { Profile } from './pages/profile/profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile/>} />

        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
