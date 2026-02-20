import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { FaWallet } from "react-icons/fa";
import authAPI from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dummyUsers = [
    { email: "admin@mail.com", password: "admin123", role: "ADMIN" },
    { email: "karyawan@mail.com", password: "karyawan123", role: "KARYAWAN" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    try {
      const response = await authAPI.login({ email, password });

      if (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.nama));
        localStorage.setItem("userRole", response.data.role);
        navigate("/dashboard");
      } else {
        setError("Email atau password salah");
      }
    } catch (err) {
      setError(err.response?.data?.error);
      console.log(err.response.data.error);
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card
        className="shadow border-0"
        style={{ width: "420px", borderRadius: "20px" }}
      >
        <Card.Body className="p-4 p-md-5">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="login-logo mx-auto mb-3">
              <FaWallet size={32} color="white" />
            </div>
            <h2 className="fw-bold text-success mb-1">Uangkasku</h2>
            <p className="text-muted small">Aplikasi Kas Karyawan</p>
          </div>

          {error && (
            <Alert
              variant="danger"
              className="mb-3"
              dismissible
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-semibold text-muted">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-muted">
              Belum punya akun? <a href="/register">Daftar</a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
