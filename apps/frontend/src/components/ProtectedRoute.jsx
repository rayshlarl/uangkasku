import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  // Check jika belum login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute