import { useEffect, useState, useRef } from "react";
import {
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaMinus,
  FaPlus,
  FaLandmark,
} from "react-icons/fa";
import ModalSetorKas from "./ModalSetorKas";
import WithDraw from "./WithDraw";
import { karyawanApi } from "../api/karyawan";
import transactionAPI from "../api/transactions";

function Sidebar({ onSetorKas, onWithdraw }) {
  const [showSetor, setShowSetor] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [karyawan, setKaryawan] = useState([]);

  const hasKaryawanFetched = useRef(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = JSON.parse(localStorage.getItem("userRole")) === "ADMIN";

  useEffect(() => {
    const isModalOpen = showSetor || showWithdraw;
    if (isModalOpen && !hasKaryawanFetched.current && karyawan.length === 0) {
      const fetchKaryawan = async () => {
        try {
          console.log("diset");
          hasKaryawanFetched.current = true;
          const response = await karyawanApi.getAll();
          setKaryawan(response);
        } catch (err) {
          console.error(err);
        }
      };
      fetchKaryawan();
    }
  }, [showSetor, showWithdraw]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleSetorKas = async (data) => {
    try {
      await transactionAPI.create({
        amount: data.jumlah,
        type: "PEMASUKAN",
        username: data.nama,
        note: data.keterangan,
        title: `Pemasukan Rp.${data.jumlah}`,
      });

      if (onSetorKas) onSetorKas(data);
      setShowSetor(false);
      alert("Setor berhasil");
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (data) => {
    try {
      await transactionAPI.create({
        amount: data.jumlah,
        type: "PENGELUARAN",
        username: data.nama,
        note: data.keterangan,
        title: `Pengeluaran Rp.${data.jumlah}`,
      });

      if (onWithdraw) onWithdraw(data);
      setShowWithdraw(false);
      alert("Setor berhasil");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-light p-3 vh-100 border-end" style={{ width: "250px" }}>
      <div className="text-center mb-4">
        <FaLandmark size={36} className="mb-2 text-success" />
        <h4 className="fw-bold">Uangkasku</h4>
      </div>

      <ul className="list-unstyled">
        <li className="mb-3">
          <button
            className="btn btn-link text-dark text-decoration-none p-0"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <FaWallet className="me-2" /> Dashboard
          </button>
        </li>
        {isAdmin && (
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <button
              className="btn btn-link text-dark text-decoration-none p-0"
              onClick={() => setShowSetor(true)}
            >
              <FaWallet className="me-2 text-primary" />
              Setoran
            </button>

            {isAdmin && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => setShowSetor(true)}
              >
                <FaPlus size={12} />
              </button>
            )}
          </li>
        )}

        {isAdmin && (
          <li className="mb-3 d-flex justify-content-between align-items-center">
            <button
              className="btn btn-link text-dark text-decoration-none p-0"
              onClick={() => setShowWithdraw(true)}
            >
              <FaWallet className="me-2 text-danger" />
              Penarikan
            </button>

            {isAdmin && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setShowWithdraw(true)}
              >
                <FaMinus size={12} />
              </button>
            )}
          </li>
        )}

        {/* Logout */}
        <li className="mt-5">
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>
        </li>
      </ul>

      {/* MODALS */}
      <ModalSetorKas
        show={showSetor}
        onHide={() => setShowSetor(false)}
        onSubmit={handleSetorKas}
        karyawanList={karyawan}
      />

      <WithDraw
        show={showWithdraw}
        onHide={() => setShowWithdraw(false)}
        onSubmit={handleWithdraw}
        karyawanList={karyawan}
      />
    </div>
  );
}

export default Sidebar;
