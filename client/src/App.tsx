import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import LearnPage from './pages/LearnPage'
import InstructorDashboardPage from './pages/InstructorDashboardPage'
import CourseFormPage from './pages/CourseFormPage'
import CourseStudentsPage from './pages/CourseStudentsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminTransactionsPage from './pages/AdminTransactionsPage'
import AdminAnalyticsPage from './pages/AdminAnalyticsPage'
import MyProgressPage from './pages/MyProgressPage'
import EnrollmentSuccessPage from './pages/EnrollmentSuccessPage'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Router>
            <AuthProvider>
              <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:courseId"
              element={
                <ProtectedRoute>
                  <LearnPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-progress"
              element={
                <ProtectedRoute>
                  <MyProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollment/success"
              element={
                <ProtectedRoute>
                  <EnrollmentSuccessPage />
                </ProtectedRoute>
              }
            />
            
            {/* Instructor routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute>
                  <InstructorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/new"
              element={
                <ProtectedRoute>
                  <CourseFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <ProtectedRoute>
                  <CourseFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/students"
              element={
                <ProtectedRoute>
                  <CourseStudentsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute>
                  <AdminCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute>
                  <AdminTransactionsPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
