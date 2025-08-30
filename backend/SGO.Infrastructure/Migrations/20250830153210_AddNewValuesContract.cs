using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SGO.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewValuesContract : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DownPaymentValue",
                table: "Contracts",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RetentionValue",
                table: "Contracts",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownPaymentValue",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "RetentionValue",
                table: "Contracts");
        }
    }
}
