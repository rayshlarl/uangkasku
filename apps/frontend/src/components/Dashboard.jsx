import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Pagination,
} from "react-bootstrap";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import transactionAPI from "../api/transactions";

function Dashboard({ stats, setStats, riwayat, setRiwayat }) {
  const [showProfile, setShowProfile] = useState(false);

  const [userStats, setUserStats] = useState({});
  const [riwayatUser, setRiwayatUser] = useState([]);
  const [pager, setPager] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [profilePager, setProfilePager] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [currentProfilePage, setCurrentProfilePage] = useState(1);

  const [showDetailSaldo, setShowDetailSaldo] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const email = JSON.parse(localStorage.getItem("email"));
  const role = JSON.parse(localStorage.getItem("userRole"));

  // Fetching pertama
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accStats = await transactionAPI.summarize();
        setStats({
          saldo: accStats.balance,
          pengeluaran: accStats.totalExp,
          pemasukan: accStats.totalInc,
          totalTransaksi: accStats.totalTrans,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Fetching base data aja
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accHistory = await transactionAPI.getAll(currentPage, 10);
        setPager(accHistory.meta);

        const formatedAllUser = accHistory.data.map((data) => ({
          nama: data.username || data.karyawan?.nama || "User",
          jumlah: data.amount,
          type: data.type,
          keterangan: data.note,
          tanggal: new Date(data.createdAt).toLocaleString("id-ID"),
        }));
        setRiwayat(formatedAllUser);
      } catch (err) {
        console.error(err?.response?.data);
      }
    };
    fetchData();
  }, [currentPage]);

  // Fetching data saat profil dibuka
  useEffect(() => {
    if (!showDetailSaldo) return;
    const fetchData = async () => {
      try {
        const accUserHistory = await transactionAPI.getAllMyTrans(
          currentProfilePage,
          10
        );
        setUserStats({
          saldo: accUserHistory.stats.balance,
          pengeluaran: accUserHistory.stats.totalExp,
          pemasukan: accUserHistory.stats.totalInc,
        });

        const formatedUserHistory = accUserHistory.data.map((data) => ({
          nama: data.username || data.karyawan?.nama || "User",
          jumlah: data.amount,
          type: data.type,
          keterangan: data.title || data.note,
          tanggal: new Date(data.createdAt).toLocaleString("id-ID"),
        }));

        setRiwayatUser(formatedUserHistory);
        setProfilePager(accUserHistory.meta);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [showDetailSaldo, currentProfilePage]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Saldo",
      value: formatRupiah(stats?.saldo || 0),
      icon: FaWallet,
      bgColor: "bg-primary bg-opacity-10",
      textColor: "text-primary",
    },
    {
      title: "Pemasukan Bulan Ini",
      value: formatRupiah(stats?.pemasukan || 0),
      icon: FaArrowUp,
      bgColor: "bg-success bg-opacity-10",
      textColor: "text-success",
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: formatRupiah(stats?.pengeluaran || 0),
      icon: FaArrowDown,
      bgColor: "bg-danger bg-opacity-10",
      textColor: "text-danger",
    },
    {
      title: "Total Transaksi",
      value: stats?.totalTransaksi || 0,
      icon: FaUsers,
      bgColor: "bg-info bg-opacity-10",
      textColor: "text-info",
    },
  ];

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Selamat datang di Uangkasku</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div
            className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={() => setShowProfile(true)}
            title="Lihat Profil"
          >
            {user[0] || "U"}
          </div>
          <div className="d-none d-md-block text-end">
            <div className="fw-semibold">{user || "User"}</div>
            <div className="small text-muted">{role || ""}</div>
          </div>
        </div>
      </div>

      {/* 1. Modal Profil Utama */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profil Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <div
              className="bg-success text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: 70,
                height: 70,
                fontWeight: "bold",
                fontSize: 32,
              }}
            >
              {user[0] || "U"}
            </div>
            <div className="fw-bold fs-5">{user || "Users"}</div>
            <div className="text-muted small mb-2">{email || "-"}</div>
            <div className="badge bg-secondary">{role || "-"}</div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            variant="outline-success"
            className="d-flex align-items-center"
            onClick={() => {
              setShowProfile(false);
              setShowDetailSaldo(true);
            }}
          >
            {/* MODAL BAGIAN PROFILE CUY */}
            <FaInfoCircle className="me-2" /> Detail Saldo Kasku
          </Button>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDetailSaldo}
        onHide={() => setShowDetailSaldo(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center text-success">
            <FaWallet className="me-2" /> Info Saldo Kasku
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4 mt-2">
            <h6
              className="text-muted mb-1 small uppercase fw-bold"
              style={{ letterSpacing: "1px" }}
            >
              Total Saldo Saat Ini
            </h6>
            <h2 className="fw-bold text-success mb-0">
              {formatRupiah(userStats?.saldo || 0)}
            </h2>
          </div>

          <div className="bg-light p-3 rounded-4 border-0 mb-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">
                <FaArrowUp className="text-success me-2" /> Pemasukan
              </span>
              <span className="fw-bold text-success">
                +{formatRupiah(userStats?.pemasukan || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                <FaArrowDown className="text-danger me-2" /> Pengeluaran
              </span>
              <span className="fw-bold text-danger">
                -{formatRupiah(userStats?.pengeluaran || 0)}
              </span>
            </div>
          </div>

          {/* BAGIAN HISTORY TRANSAKSI */}
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <i className="bi bi-clock-history me-2 text-primary"></i> Riwayat
            Transaksi
          </h6>

          {/* Container dengan Scrollbar */}
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {riwayatUser?.length === 0 ? (
              <div className="text-center py-4 border rounded-3 border-dashed">
                <p className="text-muted small mb-0">
                  Belum ada riwayat transaksi
                </p>
              </div>
            ) : (
              riwayatUser.map((item, index) => {
                const isSetoran = item.type === "PEMASUKAN";
                return (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between p-2 mb-2 border-bottom"
                  >
                    <div className="d-flex align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          isSetoran
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                        style={{
                          width: "35px",
                          height: "35px",
                          minWidth: "35px",
                        }}
                      >
                        {isSetoran ? (
                          <FaArrowUp size={12} />
                        ) : (
                          <FaArrowDown size={12} />
                        )}
                      </div>

                      <div>
                        <div
                          className="fw-bold text-dark mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          {item.keterangan ||
                            (isSetoran ? "Setor Kas" : "Tarik Kas")}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "11px" }}
                        >
                          {item.nama} • {item.tanggal}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`fw-bold text-end ${
                        isSetoran ? "text-success" : "text-danger"
                      }`}
                      style={{ fontSize: "14px" }}
                    >
                      {isSetoran ? "+" : "-"}
                      {formatRupiah(Math.abs(item.jumlah))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowDetailSaldo(false);
              setShowProfile(true);
            }}
          >
            Kembali
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Card Stats */}
      <Row className="g-3 mb-4">
        {statCards.map((stat, index) => (
          <Col md={6} lg={3} key={index}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-1 small">{stat.title}</p>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                  <div
                    className={`${stat.bgColor} ${stat.textColor} p-3 rounded`}
                  >
                    <stat.icon size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabel Riwayat */}
      <Row className="g-3">
        <Col lg={12}>
          {" "}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Riwayat Transaksi Terakhir</h5>
            </Card.Header>
            <Card.Body>
              {riwayat?.length === 0 ? (
                <p className="text-muted text-center py-4">
                  Belum ada data transaksi.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Nama Karyawan</th>
                        <th>Jumlah</th>
                        <th>Keterangan</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riwayat?.map((item, i) => (
                        <tr key={i}>
                          <td className="fw-medium">{item.nama}</td>
                          <td
                            className={
                              item.type === "PENGELUARAN"
                                ? "text-danger fw-bold"
                                : "text-success fw-bold"
                            }
                          >
                            {item.type === "PENGELUARAN" ? "-" : "+"}
                            {formatRupiah(Math.abs(item.jumlah))}
                          </td>
                          <td>{item.keterangan || "-"}</td>
                          <td className="text-muted small">{item.tanggal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage <= 1}
                  >
                    back
                  </button>
                  <button>{currentPage}</button>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= pager.totalPages}
                  >
                    next
                  </button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
