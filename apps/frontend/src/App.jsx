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
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import transactionAPI from "./api/transactions";
import { karyawanApi } from "./api/karyawan";

function App() {
  const [showSetor, setShowSetor] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Karena sekarang user adalah JSON object (sesuai kode temanmu)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin =
    user.role === "ADMIN" || localStorage.getItem("userRole") === "ADMIN";

  // State untuk stats dan riwayat agar bisa diubah dari Sidebar
  const [stats, setStats] = useState({});
  const [karyawan, setKaryawan] = useState([]);
  const [riwayat, setRiwayat] = useState([]);

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await transactionAPI.getAll();
        const karyawanData = await karyawanApi.getAll();

        setKaryawan(karyawanData);

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

        setStats({
          pemasukan: value.incomes,
          pengeluaran: value.expenses,
          saldo: value.saldo,
          totalTransaksi: value.totalTrans,
        });

        // Set Riwayat dari database
        const formattedRiwayat = response.map((t) => ({
          nama: t.username || t.karyawan?.nama || "Unknown",
          jumlah: t.type === "PENGELUARAN" ? -t.amount : t.amount,
          keterangan: t.title || t.note,
          tanggal: new Date(t.createdAt).toLocaleString("id-ID"),
        }));
        // Ambil 10 transaksi terakhir
        setRiwayat(formattedRiwayat.slice(0, 10));
      } catch (err) {
        console.log("Gagal mengambil data dari API", err);
      }
    };
    fetchData();
  }, []);

  // Handler setor kas global
  const handleSetorKas = async ({ jumlah, keterangan, nama }) => {
    try {
      const createTrans = {
        amount: Number(jumlah),
        username: nama,
        title: keterangan || "Setor Kas",
        type: "PEMASUKAN",
        note: keterangan,
      };

      setStats((prev) => ({
        ...prev,
        pemasukan: (prev.pemasukan || 0) + Number(jumlah),
        saldo: (prev.saldo || 0) + Number(jumlah),
        totalTransaksi: (prev.totalTransaksi || 0) + 1,
      }));

      setRiwayat((prev) => [
        {
          nama,
          jumlah: Number(jumlah),
          keterangan,
          tanggal: new Date().toLocaleString("id-ID"),
        },
        ...prev,
      ]);

      await transactionAPI.create(createTrans);
      setShowSetor(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async ({ jumlah, keterangan, nama }) => {
    // Karena dari form sidebar kadang dikirim dengan angka minus
    const amountAbs = Math.abs(Number(jumlah));
    try {
      const createTrans = {
        amount: amountAbs,
        username: nama,
        title: keterangan || "Tarik Kas",
        type: "PENGELUARAN",
        note: keterangan,
      };

      setStats((prev) => ({
        ...prev,
        pengeluaran: (prev.pengeluaran || 0) + amountAbs,
        saldo: (prev.saldo || 0) - amountAbs,
        totalTransaksi: (prev.totalTransaksi || 0) + 1,
      }));

      setRiwayat((prev) => [
        {
          nama,
          jumlah: -amountAbs, // Pastikan minus agar tabel berubah merah
          keterangan,
          tanggal: new Date().toLocaleString("id-ID"),
        },
        ...prev,
      ]);

      await transactionAPI.create(createTrans);
      setShowWithdraw(false);
    } catch (e) {
      console.error(e);
    }
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
                  onSetorKas={(data) =>
                    data.jumlah > 0
                      ? handleSetorKas(data)
                      : handleWithdraw(data)
                  }
                />
                <div className="flex-grow-1">
                  {/* Tombol Aksi hanya untuk admin */}

                  <Dashboard stats={stats} riwayat={riwayat} />

                  {/* Modal Setor Kas */}
                  {isAdmin && (
                    <ModalSetorKas
                      show={showSetor}
                      onHide={() => setShowSetor(false)}
                      onSubmit={handleSetorKas}
                      karyawanList={karyawan}
                    />
                  )}

                  {/* Modal Penarikan Kas */}
                  {isAdmin && (
                    <WithDraw
                      show={showWithdraw}
                      onHide={() => setShowWithdraw(false)}
                      onSubmit={handleWithdraw}
                      karyawanList={karyawan}
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
