using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusToContractInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "ContractInvoices",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "ContractInvoices");
        }
    }
}
