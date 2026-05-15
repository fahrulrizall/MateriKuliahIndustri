// utility.js
export function formatStatus(status) {
  switch (status) {
    case 0:
      return { label: "Menunggu", variant: "warning" };
    case 1:
      return { label: "Dikonfirmasi", variant: "success" };
    case 2:
      return { label: "Dibatalkan", variant: "danger" };
    case 3:
      return { label: "Selesai", variant: "info" };
    default:
      return { label: "Unknown", variant: "secondary" };
  }
}

export function formatJenisKelamin(jenisKelamin) {
  return jenisKelamin === 0 ? "Laki-laki" : "Perempuan";
}
