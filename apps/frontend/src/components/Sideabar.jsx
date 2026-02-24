import { useState } from 'react';
import { FaWallet, FaUser, FaSignOutAlt, FaMinus, FaPlus, FaLandmark } from 'react-icons/fa';
import ModalSetorKas from './ModalSetorKas';
import WithDraw from './WithDraw';

const dummyKaryawan = [
  { nama: 'Budi Santoso' },
  { nama: 'Siti Nurhaliza' },
  { nama: 'Ahmad Rizky' },
  { nama: 'Dewi Lestari' },
  { nama: 'Rudi Hartono' },
];

function Sidebar({ onSetorKas }) {
  const [showSetor, setShowSetor] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSetorKas = (data) => {
    if (onSetorKas) onSetorKas(data);
    setShowSetor(false);
    alert('Setor berhasil');
  };

  const handleWithdraw = (data) => {
    if (onSetorKas) {
      onSetorKas({
        ...data,
        jumlah: -Math.abs(data.jumlah),
      });
    }
    setShowWithdraw(false);
    alert('Penarikan berhasil');
  };

  return (
    <div className="bg-light p-3 vh-100 border-end" style={{ width: '250px' }}>
      <div className="text-center mb-4">
        <FaLandmark size={36} className="mb-2 text-success" />
        <h4 className="fw-bold">Uangkasku</h4>
      </div>

      <ul className="list-unstyled">

        <li className="mb-3">
          <button
            className="btn btn-link text-dark text-decoration-none p-0"
            onClick={() => window.location.href = '/dashboard'}
          >
            <FaWallet className="me-2" /> Dashboard
          </button>
        </li>

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
        karyawanList={dummyKaryawan}
      />

      <WithDraw
        show={showWithdraw}
        onHide={() => setShowWithdraw(false)}
        onSubmit={handleWithdraw}
        karyawanList={dummyKaryawan}
      />
    </div>
  );
}

export default Sidebar;