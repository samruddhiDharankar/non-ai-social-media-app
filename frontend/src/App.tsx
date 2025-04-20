import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreatePostPage from './pages/CreatePostPage'
import UserProfilePage from './pages/UserProfilePage'
import Layout from './pages/Layout'

function App() {

  return (
    <>

      <Routes>
        {/*Public routes*/}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/*Private routes*/}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/create-post" element={
          <ProtectedRoute>
            <Layout>
              <CreatePostPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/me" element={
          <ProtectedRoute>
            <Layout>
              <UserProfilePage />
            </Layout>
          </ProtectedRoute>
        } />

      </Routes>

      {/* <LoginForm /> */}
      {/* <SignupForm /> */}
    </>
  )
}

export default App
