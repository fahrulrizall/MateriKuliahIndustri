import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  ArrowLeft as BackIcon,
  Check as CheckIcon,
  Hospital as HospitalIcon,
  Person as PersonIcon,
  FileText as DescriptionIcon,
  GenderMale,
  GenderFemale,
} from "react-bootstrap-icons";
import { reservasiApi } from "../api/reservasiApi";
import { formatJenisKelamin, formatStatus } from "../helpers/utility";

const DetailReservasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservasi, setReservasi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchDetailReservasi = useCallback(async () => {
    try {
      const response = await reservasiApi.getById(id);
      setReservasi(response.data);
      setIsError(false);
    } catch (error) {
      console.error("Gagal mengambil detail reservasi:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    fetchDetailReservasi();
  }, [fetchDetailReservasi]);

  const handleKonfirmasi = async () => {
    setIsConfirming(true);
    try {
      await reservasiApi.konfirmasi(id);
      setSnackbar({
        open: true,
        message: "Reservasi berhasil dikonfirmasi!",
        severity: "success",
      });
      fetchDetailReservasi();
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

  if (isLoading)
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  if (isError)
    return (
      <Container className="p-5">
        <Alert variant="danger">
          Gagal memuat detail reservasi. Silakan coba lagi.
        </Alert>
      </Container>
    );

  const data = reservasi;

  return (
    <Container fluid className="bg-light min-vh-100 p-3 p-md-4">
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <BackIcon className="me-1" /> Kembali
      </Button>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            <span>
              <HospitalIcon className="me-2" />
              Detail Reservasi
            </span>
            <Badge bg={formatStatus(data?.status).variant} className="fs-6">
              {formatStatus(data?.status).label}
            </Badge>
          </Card.Title>
          <Row className="mt-4">
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                  <PersonIcon className="me-2" />
                  Informasi Pasien
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Nama
                    </Col>
                    <Col sm={8}>{data?.nama}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Alamat
                    </Col>
                    <Col sm={8}>{data?.alamat || "-"}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Telepon
                    </Col>
                    <Col sm={8}>{data?.telepon}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Tgl. Lahir
                    </Col>
                    <Col sm={8}>
                      {dayjs(data?.tanggalLahir).format("DD MMMM YYYY")}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Jenis Kelamin
                    </Col>
                    <Col sm={8}>
                      {formatJenisKelamin(data?.jenisKelamin)}{" "}
                      {data?.jenisKelamin === 0 ? (
                        <GenderMale />
                      ) : (
                        <GenderFemale />
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header className="bg-info text-white">
                  <DescriptionIcon className="me-2" />
                  Informasi Reservasi
                </Card.Header>
                <Card.Body>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Tgl. Reservasi
                    </Col>
                    <Col sm={8}>
                      {dayjs(data?.tanggalReservasi).format(
                        "dddd, DD MMMM YYYY HH:mm"
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4} className="fw-bold">
                      Keluhan
                    </Col>
                    <Col sm={8}>{data?.keluhan}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {data?.status === 0 && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="primary"
                onClick={handleKonfirmasi}
                disabled={isConfirming}
              >
                <CheckIcon className="me-1" />
                Konfirmasi Reservasi
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1100 }}
      >
        <Toast
          onClose={handleCloseSnackbar}
          show={snackbar.open}
          delay={3000}
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

export default DetailReservasi;
