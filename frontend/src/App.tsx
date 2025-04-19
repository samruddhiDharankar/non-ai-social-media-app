import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/LoginPage'
import Signup from './pages/SignupPage'
import Dashboard from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

      </Routes>

      {/* <LoginForm /> */}
      {/* <SignupForm /> */}
    </>
  )
}

export default App
