import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sideabar'
import ModalSetorKas from './components/ModalSetorKas'
import WithDraw from './components/WithDraw'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [showSetor, setShowSetor] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.role === 'ADMIN'

  // State untuk stats dan riwayat agar bisa diubah dari Sidebar
  const [stats, setStats] = useState({
    saldo: 5200000,
    pemasukan: 2000000,
    pengeluaran: 1000000,
    totalTransaksi: 12,
  });
  const [riwayat, setRiwayat] = useState([]);

  // Handler setor kas global
  const handleSetorKas = ({ jumlah, keterangan, nama }) => {
    setStats((prev) => ({
      ...prev,
      saldo: prev.saldo + jumlah,
      pemasukan: prev.pemasukan + jumlah,
      totalTransaksi: prev.totalTransaksi + 1,
    }));
    setRiwayat((prev) => [
      {
        nama,
        jumlah,
        keterangan,
        tanggal: new Date().toLocaleString('id-ID'),
      },
      ...prev,
    ]);
  };

  const handleWithdraw = ({ jumlah, keterangan, nama }) => {
    setStats((prev) => ({
      ...prev,
      saldo: prev.saldo - jumlah,
      pengeluaran: prev.pengeluaran + jumlah,
      totalTransaksi: prev.totalTransaksi + 1,
    }));
    setRiwayat((prev) => [
      {
        nama,
        jumlah,
        keterangan,
        tanggal: new Date().toLocaleString('id-ID'),
      },
      ...prev,
    ]);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="d-flex">
                <Sidebar onSetorKas={handleSetorKas} />
                <div className="flex-grow-1">
                  {/* Tombol Setor hanya untuk admin */}
                  {isAdmin && (
                    <div className="text-end mb-3">
                      <button className="btn btn-success" onClick={() => setShowSetor(true)}>
                        + Setor Uang Kas
                      </button>
                    </div>
                  )}
                  <Dashboard stats={stats} riwayat={riwayat} />
                  {/* Modal Setor Kas */}
                  {isAdmin && (
                    <ModalSetorKas
                      show={showSetor}
                      onHide={() => setShowSetor(false)}
                      onSubmit={() => { setShowSetor(false); }}
                    />
                  )}
                </div>
              </div>
            </ProtectedRoute>
          }
        />

          {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="d-flex">
                <Sidebar onSetorKas={handleWithdraw} />
                <div className="flex-grow-1">
                  {/* Tombol Setor hanya untuk admin */}
                  {isAdmin && (
                    <div className="text-end mb-3">
                      <button className="btn btn-success" onClick={() => setShowWithdraw(true)}>
                        + Penarikan Uang Kas
                      </button>
                    </div>
                  )}
                  <Dashboard stats={stats} riwayat={riwayat} />
                  {/* Modal Penarikan Kas */}
                  {isAdmin && (
                    <WithDraw
                      show={showWithdraw}
                      onHide={() => setShowWithdraw(false)}
                      onSubmit={handleWithdraw}
                    />
                  )}
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}


// Helper: Redirect ke dashboard jika sudah login
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default App