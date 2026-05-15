using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReservasiAPI.Data;
using ReservasiAPI.Models;

namespace ReservasiAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservasiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Reservasi>> BuatReservasi(Reservasi reservasi)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Extract date part (ignore time) for comparison
                var reservasiDate = reservasi.TanggalReservasi.Date;

                // Get the highest existing NoAntrian for the same date
                int? maxNo = await _context.Reservasi
                    .Where(r => r.TanggalReservasi.Date == reservasiDate)
                    .MaxAsync(r => (int?)r.NoAntrian);

                // Set new NoAntrian (1 if none exists, else increment max)
                reservasi.NoAntrian = maxNo.HasValue ? maxNo.Value + 1 : 1;

                _context.Reservasi.Add(reservasi);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync(); // Finalize transaction

                return CreatedAtAction(nameof(GetReservasi), new { id = reservasi.Id }, reservasi);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(); 
                return StatusCode(500, "Gagal membuat reservasi" + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Reservasi>> GetReservasi(int id)
        {
            var reservasi = await _context.Reservasi.FirstOrDefaultAsync(r => r.Id == id);

            if (reservasi == null)
            {
                return NotFound();
            }

            return reservasi;
        }

        [HttpGet("hari-ini")]
        public async Task<ActionResult<IEnumerable<Reservasi>>> GetReservasiHariIni()
        {
            var hariIni = DateTime.Today;
            return await _context.Reservasi
                .Where(r => r.TanggalReservasi.Date == hariIni)
                .ToListAsync();
        }

        [HttpPut("{id}/konfirmasi")]
        public async Task<IActionResult> KonfirmasiReservasi(int id)
        {
            var reservasi = await _context.Reservasi.FindAsync(id);
            if (reservasi == null)
            {
                return NotFound();
            }

            reservasi.Status = StatusReservasi.Dikonfirmasi;
            _context.Entry(reservasi).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}