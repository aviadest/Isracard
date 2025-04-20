using FlightBoard.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBoard.DB
{
    public class FlightsDbContext : DbContext
    {
        public DbSet<Flight> Flights { get; set; }

        public FlightsDbContext(DbContextOptions<FlightsDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=flights.db");
            }
        }
    }
}
