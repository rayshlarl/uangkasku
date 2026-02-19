import { Link } from 'react-router-dom';
import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
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
        <li className="mb-3">
          <Link to="/karyawan" className="text-decoration-none text-dark">
            <FaUser className="me-2" /> Karyawan
          </Link>
        </li>
        <li className="mt-5">
          <button className="btn btn-outline-danger w-100">
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
