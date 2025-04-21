import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreatePostPage from './pages/CreatePostPage'
import Layout from './pages/Layout'
import UserPublicProfilePage from './pages/UserPublicProfilePage'

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
              <UserPublicProfilePage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/:username" element={
          <ProtectedRoute>
            <Layout>
              <UserPublicProfilePage />
            </Layout>
          </ProtectedRoute>
        } />

      </Routes>
    </>
  )
}

export default App
