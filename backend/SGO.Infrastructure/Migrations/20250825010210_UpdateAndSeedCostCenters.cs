using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAndSeedCostCenters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectExpenses_Contracts_ContractId",
                table: "ProjectExpenses");

            migrationBuilder.AlterColumn<Guid>(
                name: "ContractId",
                table: "ProjectExpenses",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000004"),
                column: "Name",
                value: "Despesas de luz, água e internet");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000006"),
                column: "Name",
                value: "EPI's e uniformes");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000010"),
                column: "Name",
                value: "Folhas de pagamento");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000017"),
                column: "Name",
                value: "Locação de Munck/ Guindaste");

            migrationBuilder.InsertData(
                table: "CostCenters",
                columns: new[] { "Id", "CompanyId", "Name" },
                values: new object[,]
                {
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000023"), null, "Folhas de 13º" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000024"), null, "Folhas de Adiantamento Salarial" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000025"), null, "Folhas de férias" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000026"), null, "Serviços de Engenharia (ART, Projetos)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000027"), null, "Tributos (guias de INSS. FGTS, DCTFWeb, Impostos)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000028"), null, "Veículos (multas, licenciamentos, taxas)" },
                    { new Guid("c1b7c9b0-1000-4000-8000-000000000029"), null, "Verbas rescisórias" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectExpenses_Contracts_ContractId",
                table: "ProjectExpenses",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectExpenses_Contracts_ContractId",
                table: "ProjectExpenses");

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000023"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000024"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000025"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000026"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000027"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000028"));

            migrationBuilder.DeleteData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000029"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ContractId",
                table: "ProjectExpenses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000004"),
                column: "Name",
                value: "Despesas de luz, agua e internet");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000006"),
                column: "Name",
                value: "EPI's e Uniformes");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000010"),
                column: "Name",
                value: "Folha de pagamento e rescisões");

            migrationBuilder.UpdateData(
                table: "CostCenters",
                keyColumn: "Id",
                keyValue: new Guid("c1b7c9b0-1000-4000-8000-000000000017"),
                column: "Name",
                value: "Locação de munck");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectExpenses_Contracts_ContractId",
                table: "ProjectExpenses",
                column: "ContractId",
                principalTable: "Contracts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
