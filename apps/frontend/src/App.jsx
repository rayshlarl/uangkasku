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
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect } from "react";
import transactionAPI from "./api/transactions";

function App() {
  const [showSetor, setShowSetor] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  // State untuk stats dan riwayat agar bisa diubah dari Sidebar
  const [stats, setStats] = useState({});
  const [riwayat, setRiwayat] = useState([]);

  //Implementasi penggunaan api cuy
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await transactionAPI.getAll();

        const value = response.reduce(
          (acc, data) => {
            acc.totalTrans = acc.totalTrans + 1;
            if (data.type === "PEMASUKAN") {
              acc.incomes = acc.incomes + data.amount;
            } else if (data.type === "PENGELUARAN") {
              acc.expenses = acc.expenses + data.amount;
            }
            acc.saldo = acc.incomes - acc.expenses;
            return acc;
          },
          { totalTrans: 0, incomes: 0, expenses: 0, saldo: 0 }
        );
        console.log(value);
        setStats((prev) => ({
          ...prev,
          pemasukan: value.incomes,
          pengeluaran: value.expenses,
          saldo: value.saldo,
          totalTransaksi: value.totalTrans,
        }));
      } catch (err) {
        //Bisa lah pasang notif error kalo emang error :v
        console.log(err);
      }
    };
    fetchData();
  }, []);

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
                      <button
                        className="btn btn-success"
                        onClick={() => setShowSetor(true)}
                      >
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
                      onSubmit={() => {
                        setShowSetor(false);
                      }}
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
