using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedStandardCostCenters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "CostCenters",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.InsertData(
                table: "CostCenters",
                columns: new[] { "Id", "CompanyId", "Name" },
                values: new object[,]
                {
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000001"), null, "Alimentação/ mercado" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000002"), null, "Combustível" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000003"), null, "Despesas de aluguel" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000004"), null, "Despesas de luz, agua e internet" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000005"), null, "Diesel" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000006"), null, "EPI's e Uniformes" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000007"), null, "Exames e Clínicas (admissionais, periódicos, demissionais)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000008"), null, "Farmácia e medicamentos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000009"), null, "Ferramentas/ ferragens" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000010"), null, "Folha de pagamento e rescisões" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000011"), null, "Honorários administrativos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000012"), null, "Honorários de contabilidade" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000013"), null, "Honorários jurídicos" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000014"), null, "Hospedagens" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000015"), null, "Locação de Container" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000016"), null, "Locação de PTA" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000017"), null, "Locação de munck" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000018"), null, "Mecânica e manutenções" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000019"), null, "Passagens de folga de campo" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000020"), null, "Passagens de funcionários (admissão e rescisão)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000021"), null, "Pedágios" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000022"), null, "Serviços de treinamento" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000001"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000002"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000003"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000004"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000005"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000006"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000007"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000008"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000009"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000010"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000011"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000012"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000013"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000014"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000015"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000016"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000017"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000018"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000019"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000020"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000021"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000022"));

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "CostCenters",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
