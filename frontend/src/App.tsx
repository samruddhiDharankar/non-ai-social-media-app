import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreatePostPage from './pages/CreatePostPage'
import Layout from './pages/Layout'
import UserPublicProfilePage from './pages/UserPublicProfilePage'
import { useEffect } from 'react'
import { useAuthStore } from './utils/useAuthStore'
import { ThemeProvider } from './context/ThemeContext'
const VITE_API_URL = import.meta.env.VITE_API_URL;

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
          // credentials: "include",
        });
        if (response.ok) {

          const userData = await response.json();
          setUser({
            userId: userData._id,
            username: userData.username
          });
        }
      } catch (err) {
        console.log("Error loading user", err);
      }
    }
    fetchUser();
  }, [setUser]);

  return (
    <>
      <ThemeProvider>
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
      </ThemeProvider>
    </>
  )
}

export default App
