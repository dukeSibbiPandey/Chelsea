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

        //public virtual DbSet<Results> Results { get; set; }
    }
    
}
