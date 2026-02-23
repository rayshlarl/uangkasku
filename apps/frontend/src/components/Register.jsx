import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { FaWallet } from 'react-icons/fa';
import api from '../api/axios';

function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('KARYAWAN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post('/karyawan', { nama, email, password, role });
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Card className="p-4 shadow" style={{ minWidth: 350 }}>
        <div className="text-center mb-3">
          <FaWallet size={32} className="mb-2 text-success" />
          <h3 className="fw-bold text-success">Daftar Akun</h3>
        </div>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control type="text" value={nama} onChange={e => setNama(e.target.value)} required disabled={loading} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={e => setRole(e.target.value)} disabled={loading}>
              <option value="KARYAWAN">KARYAWAN</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" variant="success" className="w-100" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </Form>
        {error && <div className="text-danger mt-2 small">{error}</div>}
        {success && <div className="text-success mt-2 small">{success}</div>}
      </Card>
    </Container>
  );
}

export default Register;
