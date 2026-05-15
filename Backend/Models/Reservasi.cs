namespace ReservasiAPI.Models
{
    public class Reservasi
    {
        public int Id { get; set; }
        
        public int NoAntrian { get; set; }

        public DateTime TanggalReservasi { get; set; }

        public string Nama { get; set; } = string.Empty;

        public string Alamat { get; set; } = string.Empty;

        public string Telepon { get; set; } = string.Empty;

        public DateTime TanggalLahir { get; set; }

        public JenisKelamin JenisKelamin { get; set; }

        public string Keluhan { get; set; } = string.Empty;

        public StatusReservasi Status { get; set; } = StatusReservasi.Dibuat;
    }

    public enum JenisKelamin
    {
        LakiLaki,
        Perempuan
    }
    
    public enum StatusReservasi
    {
        Dibuat,
        Dikonfirmasi,
        Dibatalkan,
        Selesai
    }
}