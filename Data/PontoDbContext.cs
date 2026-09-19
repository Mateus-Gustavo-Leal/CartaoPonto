using Microsoft.EntityFrameworkCore;
using Cartao_Ponto.Models;

namespace Cartao_Ponto.Data
{
    public class PontoDbContext : DbContext
    {
        public PontoDbContext(DbContextOptions<PontoDbContext> options)
            : base(options)
        {
        }

        public DbSet<RegistroPonto> RegistrosPonto { get; set; }
    }
}