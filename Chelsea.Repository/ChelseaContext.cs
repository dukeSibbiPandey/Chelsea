using Microsoft.EntityFrameworkCore;
using System;

namespace Chelsea.Repository
{
    public class ChelseaContext: DbContext
    {
        public ChelseaContext()
        {
        }

        public ChelseaContext(DbContextOptions<ChelseaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Submittal> Submittal { get; set; }
        public virtual DbSet<AddressMaster> AddressMaster { get; set; }
        public virtual DbSet<CityMaster> CityMaster { get; set; }
        public virtual DbSet<StateMaster> StateMaster { get; set; }
        public virtual DbSet<SubmittalList> vwSubmittals { get; set; }
        public virtual DbSet<AddressMasterList> vwAddress { get; set; }
        public virtual DbSet<PdfFiles> PdfFiles { get; set; }
        public virtual DbSet<PdfFileDetails> PdfFileDetails { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<ProjectManager> PMs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(x => x.Name);
            });
            modelBuilder.Entity<ProjectManager>(entity =>
            {
                entity.HasKey(x => x.Name);
            });
        }
    }
    
}
