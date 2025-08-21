namespace SGO.Infrastructure;

using Microsoft.EntityFrameworkCore;
using SGO.Core; 

public class SgoDbContext : DbContext
{
    public SgoDbContext(DbContextOptions<SgoDbContext> options) : base(options)
    {
    }   

    public DbSet<Project> Projects { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<ProjectExpense> ProjectExpenses { get; set; }
    public DbSet<CostCenter> CostCenters { get; set; }
    
    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}