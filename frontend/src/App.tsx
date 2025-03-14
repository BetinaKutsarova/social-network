import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Navbar from './components/layout/Navbar/Navbar'
import { Login } from './pages/login/login'
import { Register } from './pages/register/register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
