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
import WithDraw from "./components/WithDraw"; // Import modal baru
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect } from "react";
import transactionAPI from "./api/transactions";
import { karyawanApi } from "./api/karyawan";

function App() {
  const [showSetor, setShowSetor] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false); // State untuk modal penarikan
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  // State untuk stats dan riwayat agar bisa diubah dari Sidebar
  const [stats, setStats] = useState({});
  const [karyawan, setKaryawan] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [createTransactionData, setCreateTransactionData] = useState({});

  //Implementasi penggunaan api cuy
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await transactionAPI.getAll();
        const karyawanData = await karyawanApi.getAll();

        setKaryawan(karyawanData);
        console.log(stats);

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
    console.log(jumlah);
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
                  {/* Tombol Aksi hanya untuk admin */}
                  {isAdmin && (
                    <div className="text-end mb-3 d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={() => setShowWithdraw(true)}
                      >
                        - Tarik Uang Kas
                      </button>
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
                      onSubmit={async (dataSetoran) => {
                        const createTrans = {
                          amount: dataSetoran.jumlah,
                          username: dataSetoran.nama,
                          title: dataSetoran.keterangan,
                          type: "PEMASUKAN",
                          note: dataSetoran.keterangan,
                        };
                        setStats((prev) => ({
                          ...prev,
                          pemasukan:
                            (prev.pemasukan || 0) + Number(dataSetoran.jumlah),
                          saldo: (prev.saldo || 0) + Number(dataSetoran.jumlah),
                          totalTransaksi: (prev.totalTransaksi || 0) + 1,
                        }));
                        await transactionAPI.create(createTrans);
                      }}
                      karyawanList={karyawan}
                    />
                  )}

                  {/* Modal Tarik Kas (Withdraw) */}
                  {isAdmin && (
                    <WithDraw
                      show={showWithdraw}
                      onHide={() => setShowWithdraw(false)}
                      onSubmit={async (dataPenarikan) => {
                        const createTrans = {
                          amount: dataPenarikan.jumlah,
                          username: dataPenarikan.nama,
                          title: dataPenarikan.keterangan,
                          type: "PENGELUARAN",
                          note: dataPenarikan.keterangan,
                        };
                        setStats((prev) => ({
                          ...prev,
                          pengeluaran:
                            (prev.pengeluaran || 0) + Number(dataPenarikan.jumlah),
                          saldo: (prev.saldo || 0) - Number(dataPenarikan.jumlah),
                          totalTransaksi: (prev.totalTransaksi || 0) + 1,
                        }));
                        await transactionAPI.create(createTrans);
                      }}
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