using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToContractInvoice1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "ProjectExpenses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "ProjectExpenses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
