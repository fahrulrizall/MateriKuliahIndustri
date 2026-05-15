import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { ArrowLeft, Save } from "react-bootstrap-icons";
import dayjs from "dayjs";
import { reservasiApi } from "../api/reservasiApi";

const BuatReservasi = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    tanggalLahir: dayjs().format("YYYY-MM-DD"),
    jenisKelamin: "L",
    tanggalReservasi: dayjs().add(2, "hour").format("YYYY-MM-DDTHH:mm"),
    keluhan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.telepon.trim()) newErrors.telepon = "Telepon wajib diisi";
    else if (!/^\d{10,13}$/.test(formData.telepon))
      newErrors.telepon = "Telepon harus 10-13 angka";
    if (!formData.keluhan.trim()) newErrors.keluhan = "Keluhan wajib diisi";
    if (dayjs(formData.tanggalReservasi).isBefore(dayjs().add(1, "hour"))) {
      newErrors.tanggalReservasi = "Reservasi minimal 1 jam dari sekarang";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});

      const payload = {
        ...formData,
        jenisKelamin: formData.jenisKelamin === "L" ? 0 : 1,
      };

      try {
        await reservasiApi.create(payload);
        navigate("/", {
          state: {
            message: "Reservasi berhasil dibuat!",
            severity: "success",
          },
        });
      } catch (error) {
        setErrors({
          server:
            error.response?.data?.message || "Terjadi kesalahan pada server",
        });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 p-3 p-md-4">
      <Button
        variant="outline-primary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-1" /> Kembali
      </Button>
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Buat Reservasi Baru</Card.Title>
          {errors.server && (
            <Alert variant="danger" className="mb-4">
              {errors.server}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} noValidate>
            <h5 className="mb-3">Data Pasien</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nama Lengkap <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    isInvalid={!!errors.nama}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nama}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Telepon <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    isInvalid={!!errors.telepon}
                    placeholder="081234567890"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telepon}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tanggal Lahir</Form.Label>
                      <Form.Control
                        type="date"
                        name="tanggalLahir"
                        value={formData.tanggalLahir}
                        onChange={handleChange}
                        max={dayjs().format("YYYY-MM-DD")}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Jenis Kelamin</Form.Label>
                      <Form.Select
                        name="jenisKelamin"
                        value={formData.jenisKelamin}
                        onChange={handleChange}
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr className="my-4" />
            <h5 className="mb-3">Data Reservasi</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Tanggal & Waktu Reservasi{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="tanggalReservasi"
                    value={formData.tanggalReservasi}
                    onChange={handleChange}
                    isInvalid={!!errors.tanggalReservasi}
                    min={dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tanggalReservasi}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Minimal 1 jam dari sekarang
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Keluhan <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="keluhan"
                    value={formData.keluhan}
                    onChange={handleChange}
                    isInvalid={!!errors.keluhan}
                    placeholder="Jelaskan keluhan Anda..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.keluhan}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Save className="me-2" />
                    Simpan Reservasi
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BuatReservasi;
