using Microsoft.EntityFrameworkCore;
using ReservasiAPI.Models;

namespace ReservasiAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<Reservasi> Reservasi { get; set; } = null!;
    }
}