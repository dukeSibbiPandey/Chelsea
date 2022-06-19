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
    }
    
}
