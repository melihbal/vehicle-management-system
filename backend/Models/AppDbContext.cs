using Microsoft.EntityFrameworkCore;
using PostgresAPI.Models;

namespace PostgresAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Vehicle> vehicles { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<RefreshToken> refreshTokens { get; set; }   

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Key: aracId + veriTarihi
            modelBuilder.Entity<Vehicle>()
                .HasKey(v => new { v.aracId, v.veriTarihi });

            base.OnModelCreating(modelBuilder);
        }
    }
}
