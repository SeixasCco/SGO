using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCostCenterEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostCenter",
                table: "ProjectExpenses");

            migrationBuilder.AddColumn<Guid>(
                name: "CostCenterId",
                table: "ProjectExpenses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "CostCenters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostCenters", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectExpenses_CostCenterId",
                table: "ProjectExpenses",
                column: "CostCenterId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectExpenses_CostCenters_CostCenterId",
                table: "ProjectExpenses",
                column: "CostCenterId",
                principalTable: "CostCenters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectExpenses_CostCenters_CostCenterId",
                table: "ProjectExpenses");

            migrationBuilder.DropTable(
                name: "CostCenters");

            migrationBuilder.DropIndex(
                name: "IX_ProjectExpenses_CostCenterId",
                table: "ProjectExpenses");

            migrationBuilder.DropColumn(
                name: "CostCenterId",
                table: "ProjectExpenses");

            migrationBuilder.AddColumn<string>(
                name: "CostCenter",
                table: "ProjectExpenses",
                type: "text",
                nullable: true);
        }
    }
}
