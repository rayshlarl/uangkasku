import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa';
import ModalSetorKas from './ModalSetorKas';

const dummyKaryawan = [
  { nama: 'Budi Santoso' },
  { nama: 'Siti Nurhaliza' },
  { nama: 'Ahmad Rizky' },
  { nama: 'Dewi Lestari' },
  { nama: 'Rudi Hartono' },
];

// Komponen Sidebar
function Sidebar({ onSetorKas }) {
  const [showSetor, setShowSetor] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';
  const [riwayat, setRiwayat] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Handler setor kas dari sidebar
  const handleSetorKas = ({ jumlah, keterangan, nama }) => {
    if (onSetorKas) {
      onSetorKas({ jumlah, keterangan, nama });
    }
    setRiwayat((prev) => [
      {
        nama,
        jumlah,
        keterangan,
        tanggal: new Date().toLocaleString('id-ID'),
      },
      ...prev,
    ]);
    setShowSetor(false);
    setTimeout(() => {
      alert(`Setor kas berhasil!\nNama: ${nama}\nJumlah: Rp${jumlah}\nKeterangan: ${keterangan}`);
    }, 100);
  };

  return (
    <div className="sidebar bg-light p-3 vh-100">
      <div className="sidebar-header mb-4 text-center">
        <FaWallet size={36} className="mb-2 text-success" />
        <h4 className="fw-bold">Uangkasku</h4>
      </div>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/dashboard" className="text-decoration-none text-dark">
            <FaUser className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="mb-3 d-flex align-items-center justify-content-between">
          <Link to="/karyawan" className="text-decoration-none text-dark">
            <FaWallet className="me-2" /> Setoran
          </Link>
          {isAdmin && (
            <button
              className="btn btn-sm btn-success ms-2"
              title="Setor Uang Kas"
              onClick={() => setShowSetor(true)}
            >
              +
            </button>
          )}
        </li>
        <li className="mt-5">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </li>
      </ul>
      {/* Modal Setor Kas */}
      {isAdmin && (
        <ModalSetorKas
          show={showSetor}
          onHide={() => setShowSetor(false)}
          onSubmit={handleSetorKas}
          karyawanList={dummyKaryawan}
        />
      )}
    </div>
  );
}

export default Sidebar;
