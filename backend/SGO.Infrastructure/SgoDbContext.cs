namespace SGO.Infrastructure;

using Microsoft.EntityFrameworkCore;
using SGO.Core;

public class SgoDbContext : DbContext
{
    public SgoDbContext(DbContextOptions<SgoDbContext> options) : base(options)
    {
    }

    public DbSet<Company> Companies { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<ProjectExpense> ProjectExpenses { get; set; }
    public DbSet<CostCenter> CostCenters { get; set; }
    public DbSet<Employee> Employees { get; set; }

    public DbSet<ProjectEmployee> ProjectEmployees { get; set; }

    public DbSet<ContractInvoice> ContractInvoices { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CostCenter>().HasData(
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000001"), Name = "Alimentação/ mercado" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000002"), Name = "Combustível" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000003"), Name = "Despesas de aluguel" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000004"), Name = "Despesas de luz, água e internet" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000005"), Name = "Diesel" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000006"), Name = "EPI's e uniformes" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000007"), Name = "Exames e Clínicas (admissionais, periódicos, demissionais)" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000008"), Name = "Farmácia e medicamentos" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000009"), Name = "Ferramentas/ ferragens" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000023"), Name = "Folhas de 13º" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000024"), Name = "Folhas de Adiantamento Salarial" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000025"), Name = "Folhas de férias" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000010"), Name = "Folhas de pagamento" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000011"), Name = "Honorários administrativos" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000012"), Name = "Honorários de contabilidade" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000013"), Name = "Honorários jurídicos" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000014"), Name = "Hospedagens" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000015"), Name = "Locação de Container" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000017"), Name = "Locação de Munck/ Guindaste" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000016"), Name = "Locação de PTA" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000018"), Name = "Mecânica e manutenções" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000019"), Name = "Passagens de folga de campo" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000020"), Name = "Passagens de funcionários (admissão e rescisão)" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000021"), Name = "Pedágios" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000026"), Name = "Serviços de Engenharia (ART, Projetos)" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000022"), Name = "Serviços de treinamento" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000027"), Name = "Tributos (guias de INSS. FGTS, DCTFWeb, Impostos)" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000028"), Name = "Veículos (multas, licenciamentos, taxas)" },
            new CostCenter { Id = new Guid("c1b7c9b0-1000-4000-8000-000000000029"), Name = "Verbas rescisórias" }
        );
    }
}