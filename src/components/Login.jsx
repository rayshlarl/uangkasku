import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { FaWallet } from 'react-icons/fa'
import { authAPI } from '../api/auth'


function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('') 

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('') 

    authAPI.login({ email, password })
      .then((response) => {
    
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('userRole', response.data.role)
        
        
        navigate('/login')
      })
      .catch((error) => {
      
        setError(error.response?.data?.message || 'Login gagal')
        console.error('Login failed:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <Card className="login-card shadow">
          <Card.Body className="p-4 p-md-5">
            
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="login-logo mx-auto mb-3">
                <FaWallet size={32} color="white" />
              </div>
              <h2 className="fw-bold text-success mb-1">Uangkasku</h2>
              <p className="text-muted small">Aplikasi Kas Karyawan</p>
            </div>

            {/* ✅ ERROR ALERT */}
            {error && (
              <Alert variant="danger" className="mb-3" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={loading}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-muted">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={loading}
                  className="py-2"
                />
              </Form.Group>

              <Button 
                variant="success" 
                type="submit" 
                className="w-100 py-2 fw-semibold login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading...
                  </>
                ) : 'Login'}
              </Button>
            </Form>

            <aside>
              <p className="text-muted small">Belum punya akun? <a href="/register">Daftar</a></p>
            </aside>

          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Login