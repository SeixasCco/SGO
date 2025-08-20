
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace SGO.Infrastructure;

public class SgoDbContextFactory : IDesignTimeDbContextFactory<SgoDbContext>
{
    public SgoDbContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
           .SetBasePath(Directory.GetCurrentDirectory())
           .AddJsonFile("appsettings.Development.json")
           .Build();

        var connectionString = configuration.GetConnectionString("SgoDbConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException(
                "A string de conexão 'SgoDbConnection' não foi encontrada dentro do appsettings.Development.json.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<SgoDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new SgoDbContext(optionsBuilder.Options);
    }
}