import { useState } from 'react'
import { Container, Row, Col, Card, Alert } from 'react-bootstrap'
import { FaWallet, FaArrowUp, FaArrowDown, FaUsers } from 'react-icons/fa'

function Dashboard() {
  // FE-only dummy stats
  const [stats, setStats] = useState({
    saldo: 5200000,
    pemasukan: 2000000,
    pengeluaran: 1000000,
    totalTransaksi: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      </div>

      {/* Stats Cards */}
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

      {/* Content Area */}
      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Riwayat Transaksi</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted text-center py-4">
                Data transaksi akan ditampilkan di sini
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">Informasi</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small mb-0">
                Dashboard menampilkan ringkasan keuangan bulan ini.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard