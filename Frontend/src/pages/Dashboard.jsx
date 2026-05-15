import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Table,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  Plus as AddIcon,
  Check as CheckIcon,
  Hospital as HospitalIcon,
  Clock as TimeIcon,
  Person as PersonIcon,
} from "react-bootstrap-icons";
import { reservasiApi } from "../api/reservasiApi";
import { formatStatus } from "../helpers/utility";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [reservasiData, setReservasiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchReservasiHariIni = useCallback(async () => {
    try {
      const response = await reservasiApi.getHariIni();
      setReservasiData(response.data || []);
      setIsError(false);
    } catch (error) {
      console.error("Gagal mengambil data reservasi:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchReservasiHariIni();

  //   const intervalId = setInterval(fetchReservasiHariIni, 30000);
  //   return () => clearInterval(intervalId);
  // }, [fetchReservasiHariIni]);

  useEffect(() => {
    fetchReservasiHariIni();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleKonfirmasi = async (id) => {
    setIsConfirming(true);
    try {
      await reservasiApi.konfirmasi(id);
      setSnackbar({
        open: true,
        message: "Reservasi berhasil dikonfirmasi!",
        severity: "success",
      });
      fetchReservasiHariIni();
    } catch {
      setSnackbar({
        open: true,
        message: "Gagal mengonfirmasi reservasi",
        severity: "danger",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Container fluid className="bg-light min-vh-100 p-3 p-md-4">
      {/* Card Statistik */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <h1 className="h4 fw-bold text-primary">
                <HospitalIcon className="me-2" />
                Sistem Reservasi Klinik
              </h1>
              <p className="text-secondary mb-2 mb-md-0">
                Manajemen reservasi pasien harian
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/buat-reservasi")}
            >
              <AddIcon className="me-1" />
              Buat Reservasi Baru
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card
            className="shadow-sm h-100"
            style={{ backgroundColor: "#e3f2fd" }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-secondary">Total Reservasi</h6>
                <h4 className="fw-bold">{reservasiData.length || 0}</h4>
              </div>
              <TimeIcon size={50} className="text-primary opacity-75" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card
            className="shadow-sm h-100"
            style={{ backgroundColor: "#e8f5e9" }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-secondary">Dikonfirmasi</h6>
                <h4 className="fw-bold">
                  {reservasiData.filter((r) => r.status === 1).length || 0}
                </h4>
              </div>
              <CheckIcon size={50} className="text-success opacity-75" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="shadow-sm h-100"
            style={{ backgroundColor: "#ffecb3" }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-secondary">Menunggu</h6>
                <h4 className="fw-bold">
                  {reservasiData.filter((r) => r.status === 0).length || 0}
                </h4>
              </div>
              <PersonIcon size={50} className="text-warning opacity-75" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabel Reservasi */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold">
              Reservasi Hari Ini ({dayjs().format("DD MMMM YYYY")})
            </h2>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setIsLoading(true);
                fetchReservasiHariIni();
              }}
              disabled={isLoading}
            >
              Refresh Data
            </Button>
          </div>
          {isLoading ? (
            <div className="text-center p-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : isError ? (
            <Alert variant="danger">
              Gagal memuat data reservasi. Silakan coba lagi.
            </Alert>
          ) : reservasiData.length === 0 ? (
            <div className="text-center p-4">
              <p className="h6 text-secondary">Tidak ada reservasi hari ini</p>
            </div>
          ) : (
            <Table responsive striped bordered hover>
              <thead className="table-light">
                <tr>
                  <th>No. Antrian</th>
                  <th>Nama Pasien</th>
                  <th>Waktu Reservasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {reservasiData.map((reservasi) => (
                  <tr key={reservasi.id}>
                    <td className="fw-bold">#{reservasi.noAntrian}</td>
                    <td>{reservasi.nama}</td>
                    <td>{dayjs(reservasi.tanggalReservasi).format("HH:mm")}</td>
                    <td>
                      <Badge bg={formatStatus(reservasi.status).variant}>
                        {formatStatus(reservasi.status).label}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {reservasi.status === 0 ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleKonfirmasi(reservasi.id)}
                            disabled={isConfirming}
                          >
                            <CheckIcon className="me-1" />
                            Konfirmasi
                          </Button>
                        ) : (
                          <Button variant="outline-success" size="sm" disabled>
                            Terkonfirmasi
                          </Button>
                        )}
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/reservasi/${reservasi.id}`)}
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Notifikasi Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1100 }}
      >
        <Toast
          onClose={handleCloseSnackbar}
          show={snackbar.open}
          delay={4000}
          autohide
          bg={snackbar.severity}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{snackbar.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Dashboard;
