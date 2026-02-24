import { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaMoneyBillWave } from 'react-icons/fa';

// Komponen Modal untuk Penarikan Uang Kas
function WithDraw({ show, onHide, onSubmit, karyawanList = [] }) {
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!jumlah || isNaN(jumlah) || Number(jumlah) <= 0) {
      setError('Jumlah harus diisi dan lebih dari 0');
      setLoading(false);
      return;
    }
    if (!nama) {
      setError('Pilih nama karyawan');
      setLoading(false);
      return;
    }
    try {
      await onSubmit({ jumlah: Number(jumlah), keterangan, nama });
      setJumlah('');
      setKeterangan('');
      setNama('');
      onHide();
    } catch (err) {
      setError('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaMoneyBillWave className="me-2 text-success" /> Penarikan Uang Kas
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nama Karyawan</Form.Label>
            <Form.Select value={nama} onChange={e => setNama(e.target.value)} required disabled={loading}>
              <option value="">Pilih nama karyawan</option>
              {karyawanList.map((k, idx) => (
                <option key={idx} value={k.nama}>{k.nama}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Jumlah Penarikan</Form.Label>
            <InputGroup>
              <InputGroup.Text>Rp</InputGroup.Text>
              <Form.Control
                type="number"
                min="1"
                value={jumlah}
                onChange={e => setJumlah(e.target.value)}
                placeholder="Masukkan jumlah"
                required
                disabled={loading}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Keterangan (opsional)</Form.Label>
            <Form.Control
              type="text"
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              placeholder="Contoh: penarikan bulan Februari"
              disabled={loading}
            />
          </Form.Group>
          {error && <div className="text-danger small mt-2">{error}</div>}
        </Modal.Body>
       <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="danger" disabled={loading}>
            <FaMoneyBillWave className="me-1" /> {loading ? 'Memproses...' : 'Tarik Uang'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default WithDraw;
