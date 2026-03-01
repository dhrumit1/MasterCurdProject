using Microsoft.EntityFrameworkCore;

namespace MasterCrud.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Product => Set<Product>();
        public DbSet<Orders> Orders => Set<Orders>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>().HasKey(o => o.ProductId);
            modelBuilder.Entity<Orders>().HasKey(o => new { o.OrderId, o.OrderSeq });

            modelBuilder.Entity<Orders>()
            .HasOne(o => o.Product)
            .WithMany(p => p.Orders)
            .HasForeignKey(o => o.ProductId);
        }
    }
}
