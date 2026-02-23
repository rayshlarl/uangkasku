import { useState } from 'react'
import { Container, Row, Col, Card, Alert, Modal, Button } from 'react-bootstrap'
import { FaWallet, FaArrowUp, FaArrowDown, FaUsers } from 'react-icons/fa'

function Dashboard({ stats, riwayat }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const statCards = [
    {
      title: 'Total Saldo',
      value: formatRupiah(stats?.saldo || 0),
      icon: FaWallet,
      color: 'primary',
      bgColor: 'bg-primary bg-opacity-10',
      textColor: 'text-primary'
    },
    {
      title: 'Pemasukan Bulan Ini',
      value: formatRupiah(stats?.pemasukan || 0),
      icon: FaArrowUp,
      color: 'success',
      bgColor: 'bg-success bg-opacity-10',
      textColor: 'text-success'
    },
    {
      title: 'Pengeluaran Bulan Ini',
      value: formatRupiah(stats?.pengeluaran || 0),
      icon: FaArrowDown,
      color: 'danger',
      bgColor: 'bg-danger bg-opacity-10',
      textColor: 'text-danger'
    },
    {
      title: 'Total Transaksi',
      value: stats?.totalTransaksi || 0,
      icon: FaUsers,
      color: 'info',
      bgColor: 'bg-info bg-opacity-10',
      textColor: 'text-info'
    }
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
            style={{width: 40, height: 40, fontWeight: 'bold', fontSize: 18, cursor: 'pointer'}}
            onClick={() => setShowProfile(true)}
            title="Lihat Profil"
          >
            {user.nama?.[0] || 'U'}
          </div>
          <div className="d-none d-md-block text-end">
            <div className="fw-semibold">
              {user.nama || 'User'}
            </div>
            <div className="small text-muted">
              {user.role || ''}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profil Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <div className="bg-success text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{width: 60, height: 60, fontWeight: 'bold', fontSize: 28}}>
              {user.nama?.[0] || 'U'}
            </div>
            <div className="fw-bold fs-5">{user.nama || 'User'}</div>
            <div className="text-muted small">{user.email || '-'}</div>
            <div className="badge bg-secondary mt-2">{user.role || '-'}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

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
                  <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Riwayat Transaksi</h5>
            </Card.Header>
            <Card.Body>
              {riwayat.length === 0 ? (
                <p className="text-muted text-center py-4">
                  Data transaksi akan ditampilkan di sini
                </p>
              ) : (
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Nama karyawan</th>
                      <th>Jumlah</th>
                      <th>Keterangan</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayat.map((r, i) => (
                      <tr key={i}>
                        <td>{r.nama}</td>
                        <td>{formatRupiah(r.jumlah)}</td>
                        <td>{r.keterangan}</td>
                        <td>{r.tanggal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Container>
  )
}

export default Dashboard