import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sideabar";
import ModalSetorKas from "./components/ModalSetorKas";
import WithDraw from "./components/WithDraw";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AccordionHeader } from "react-bootstrap";

function App() {
  const [stats, setStats] = useState({
    saldo: 0,
    pemasukan: 0,
    pengeluaran: 0,
    totalTransaksi: 0,
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
        tanggal: new Date().toLocaleString("id-ID"),
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
        tanggal: new Date().toLocaleString("id-ID"),
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
                <Sidebar
                  onSetorKas={handleSetorKas}
                  onWithdraw={handleWithdraw}
                />
                <div className="flex-grow-1">
                  <Dashboard
                    stats={stats}
                    setStats={setStats}
                    riwayat={riwayat}
                    setRiwayat={setRiwayat}
                  />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

// Helper: Redirect ke dashboard jika sudah login
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default App;
